import axios from 'axios';
import { Types } from 'mongoose';
import Logger from 'n23-logger';
import { ScheduledMessageDB } from '../../mongo';
import IAccount from '../../mongo/types/account';
import IWhatsappLink from '../../mongo/types/whatsapplink';
import MetaAPI from '../config/MetaAPI';
import { IS_PRODUCTION, MESSAGE_STATUS } from '../config/const';
import DateUtils from '../utils/DateUtils';
import { extractBody, extractButtons, extractFooter, extractHeader } from '../utils/MessageHelper';
import ConversationService from './conversation';
import TemplateService from './templates';
import UserService from './user';
import WhatsappLinkService from './whatsappLink';

export default class SchedulerService extends WhatsappLinkService {
	public constructor(account: IAccount, whatsappLink: IWhatsappLink) {
		super(account, whatsappLink);
	}

	public async schedule(
		to: string,
		messageObject: {
			[key: string]: unknown;
		},
		{
			scheduler_id,
			scheduler_type,
			sendAt,
			message_type = 'normal',
		}: {
			scheduler_id: Types.ObjectId;
			scheduler_type: string;
			sendAt: Date;
			message_type: 'template' | 'normal';
		}
	) {
		const message = await ScheduledMessageDB.create({
			linked_to: this.account._id,
			device_id: this.deviceId,
			scheduler_id: scheduler_id,
			scheduled_type: scheduler_type,
			to,
			messageObject,
			sendAt,
			message_type,
		});

		return message._id;
	}

	public static async sendScheduledTemplateMessages() {
		if (!IS_PRODUCTION) return;
		let docs;
		try {
			docs = await ScheduledMessageDB.find({
				sendAt: { $lte: new Date() },
				status: MESSAGE_STATUS.PENDING,
				message_type: 'template',
			}).populate<{
				device_id: IWhatsappLink;
				linked_to: IAccount;
			}>('device_id linked_to');
		} catch (err) {
			return;
		}
		const message_ids = docs.map((msg) => msg._id);

		await ScheduledMessageDB.updateMany(
			{ _id: { $in: message_ids } },
			{
				$set: {
					status: MESSAGE_STATUS.PROCESSING,
				},
			}
		);

		docs.forEach(async (msg) => {
			const userService = new UserService(msg.linked_to);
			if (userService.walletBalance < userService.markupPrice) {
				msg.failed_at = DateUtils.getMomentNow().toDate();
				msg.failed_reason = 'Insufficient balance';
				msg.status = MESSAGE_STATUS.FAILED;
				msg.save();
				return;
			}
			try {
				const { data } = await MetaAPI(msg.device_id.accessToken).post(
					`${msg.device_id.phoneNumberId}/messages`,
					{
						messaging_product: 'whatsapp',
						to: msg.to,
						recipient_type: 'individual',
						type: 'template',
						template: {
							name: msg.messageObject.template_name,
							language: {
								code: 'en_US',
							},
							components: msg.messageObject.components,
						},
					}
				);
				msg.message_id = data.messages[0].id;
				msg.save();
				userService.deductCredit(1);
			} catch (err) {
				if (axios.isAxiosError(err)) {
					Logger.info('Error sending broadcast message', err.response?.data as string);
					msg.failed_reason = JSON.stringify(err.response?.data ?? '') as string;
				} else {
					msg.failed_reason = (err as any).message as string;
				}

				msg.failed_at = DateUtils.getMomentNow().toDate();
				msg.status = MESSAGE_STATUS.FAILED;
				msg.save();
				return;
			}

			const conversationService = new ConversationService(msg.linked_to, msg.device_id);
			const templateService = new TemplateService(msg.linked_to, msg.device_id);
			const template = await templateService.fetchTemplateByName(msg.messageObject.template_name);
			if (template) {
				const c_id = await conversationService.createConversation(msg.to);
				const header = extractHeader(template.components);
				const body = extractBody(template.components, msg.messageObject.components);
				const footer = extractFooter(template.components);
				const buttons = extractButtons(template.components);
				console.log('header', header);

				await conversationService.addMessageToConversation(c_id, {
					recipient: msg.to,
					message_id: msg.message_id,
					...(header ? { ...header } : {}),
					...(body ? { body: { body_type: 'TEXT', text: body } } : {}),
					...(footer ? { footer_content: footer } : {}),
					...(buttons ? { buttons } : {}),
					scheduled_by: {
						id: msg.scheduler_id,
						name: msg.scheduler_type,
					},
				});
				msg.remove();
			}
		});
	}

	public static async sendScheduledMessages() {
		if (!IS_PRODUCTION) return;
		let docs;
		try {
			docs = await ScheduledMessageDB.find({
				sendAt: { $lte: new Date() },
				status: MESSAGE_STATUS.PENDING,
				message_type: 'normal',
			}).populate<{
				device_id: IWhatsappLink;
				linked_to: IAccount;
			}>('device_id linked_to');
		} catch (err) {
			return;
		}
		const message_ids = docs.map((msg) => msg._id);

		await ScheduledMessageDB.updateMany(
			{ _id: { $in: message_ids } },
			{
				$set: {
					status: MESSAGE_STATUS.PROCESSING,
				},
			}
		);

		docs.forEach(async (msg) => {
			const userService = new UserService(msg.linked_to);
			if (userService.walletBalance < userService.markupPrice) {
				msg.failed_at = DateUtils.getMomentNow().toDate();
				msg.failed_reason = 'Insufficient balance';
				msg.status = MESSAGE_STATUS.FAILED;
				msg.save();
				return;
			}
			try {
				const { data } = await MetaAPI(msg.device_id.accessToken).post(
					`${msg.device_id.phoneNumberId}/messages`,
					{
						messaging_product: 'whatsapp',
						to: msg.to,
						recipient_type: 'individual',
						...msg.messageObject,
					}
				);
				msg.message_id = data.messages[0].id;
				msg.save();
			} catch (err) {
				if (axios.isAxiosError(err)) {
					Logger.info('Error sending broadcast message', err.response?.data as string);
					msg.failed_reason = JSON.stringify(err.response?.data ?? '') as string;
				} else {
					msg.failed_reason = (err as any).message as string;
				}

				msg.failed_at = DateUtils.getMomentNow().toDate();
				msg.status = MESSAGE_STATUS.FAILED;
				msg.save();
				return;
			}
			userService.deductCredit(1);
			const data = msg.messageObject;

			const conversationService = new ConversationService(msg.linked_to, msg.device_id);
			const c_id = await conversationService.createConversation(msg.to);
			await conversationService.addMessageToConversation(c_id, {
				recipient: msg.to,
				message_id: msg.message_id,
				body: {
					body_type:
						data.type === 'text'
							? 'TEXT'
							: data.type === 'contacts'
							? 'CONTACT'
							: data.type === 'location'
							? 'LOCATION'
							: 'MEDIA',
					media_id: ['image', 'video', 'document', 'audio'].includes(data.type)
						? data.media_id
						: undefined,
					text: data.text,
					contacts: data.contacts,
					location: data.location,
				},
				scheduled_by: {
					id: msg.scheduler_id,
					name: msg.scheduler_type,
				},
			});
			msg.remove();
		});
	}
}
