import axios from 'axios';
import { Types } from 'mongoose';
import { ScheduledMessageDB } from '../../mongo';
import { BroadcastDB_name } from '../../mongo/repo/Broadcast';
import { ChatBotFlowDB_name } from '../../mongo/repo/ChatbotFlow';
import IAccount from '../../mongo/types/account';
import IWhatsappLink from '../../mongo/types/whatsappLink';
import MetaAPI from '../config/MetaAPI';
import { IS_PRODUCTION, MESSAGE_STATUS } from '../config/const';
import DateUtils from '../utils/DateUtils';
import { generateRandomID } from '../utils/ExpressUtils';
import {
	extractInteractiveBody,
	extractInteractiveButtons,
	extractInteractiveFooter,
	extractInteractiveHeader,
	extractTemplateBody,
	extractTemplateButtons,
	extractTemplateFooter,
	extractTemplateHeader,
} from '../utils/MessageHelper';
import BroadcastService from './broadcast';
import ChatBotService from './chatbot';
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
			message_type: 'template' | 'normal' | 'interactive';
		}
	) {
		const message = await ScheduledMessageDB.create({
			linked_to: this.account._id,
			device_id: this.deviceId,
			scheduler_id: scheduler_id,
			scheduler_type: scheduler_type,
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
			const conversationService = new ConversationService(msg.linked_to, msg.device_id);
			const templateService = new TemplateService(msg.linked_to, msg.device_id);
			const template = await templateService.fetchTemplateByName(msg.messageObject.template_name);
			const userService = new UserService(msg.linked_to);

			if (!template) {
				msg.failed_at = DateUtils.getMomentNow().toDate();
				msg.failed_reason = 'Template not found';
				msg.status = MESSAGE_STATUS.FAILED;
				msg.save();
				return;
			}

			const c_id = await conversationService.createConversation(msg.to);
			const header = extractTemplateHeader(template.components, msg.messageObject.components);
			const body = extractTemplateBody(template.components, msg.messageObject.components);
			const footer = extractTemplateFooter(template.components);
			const buttons = extractTemplateButtons(template.components);

			let failed_at: Date | undefined = undefined;
			let failed_reason: string | undefined = undefined;
			let status = MESSAGE_STATUS.PROCESSING;
			let message_id: string | undefined = undefined;

			if (userService.walletBalance < userService.markupPrice) {
				message_id = generateRandomID();
				failed_at = DateUtils.getMomentNow().toDate();
				failed_reason = 'Insufficient balance';
				status = MESSAGE_STATUS.FAILED;
			} else {
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
					message_id = data.messages[0].id;
					userService.deductCredit(1);
				} catch (err) {
					if (axios.isAxiosError(err)) {
						failed_reason = JSON.stringify(err.response?.data ?? '') as string;
					} else {
						failed_reason = (err as any).message as string;
					}
					failed_at = DateUtils.getMomentNow().toDate();
					status = MESSAGE_STATUS.FAILED;
				}
			}

			const addedMessage = await conversationService.addMessageToConversation(c_id, {
				recipient: msg.to,
				message_id: message_id,
				...(header ? { ...header } : {}),
				...(body ? { body: { body_type: 'TEXT', text: body } } : {}),
				...(footer ? { footer_content: footer } : {}),
				...(buttons ? { buttons } : {}),
				scheduled_by: {
					id: msg.scheduler_id,
					name: msg.scheduler_type,
				},
				failed_at,
				failed_reason,
				status,
			});

			if (addedMessage && msg.scheduler_type === BroadcastDB_name) {
				BroadcastService.updateBroadcastMessageId(msg.scheduler_id, {
					prev_id: msg._id,
					new_id: addedMessage._id,
				});
			}
			msg.remove();
		});
	}

	public static async sendScheduledNormalMessages() {
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
			const conversationService = new ConversationService(msg.linked_to, msg.device_id);
			const userService = new UserService(msg.linked_to);

			const c_id = await conversationService.createConversation(msg.to);

			let failed_at: Date | undefined = undefined;
			let failed_reason: string | undefined = undefined;
			let status = MESSAGE_STATUS.PROCESSING;
			let message_id: string | undefined = undefined;

			if (userService.walletBalance < userService.markupPrice) {
				message_id = generateRandomID();
				failed_at = DateUtils.getMomentNow().toDate();
				failed_reason = 'Insufficient balance';
				status = MESSAGE_STATUS.FAILED;
			} else {
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
					message_id = data.messages[0].id;
					userService.deductCredit(1);
				} catch (err) {
					if (axios.isAxiosError(err)) {
						failed_reason = JSON.stringify(err.response?.data ?? '') as string;
					} else {
						failed_reason = (err as any).message as string;
					}
					failed_at = DateUtils.getMomentNow().toDate();
					status = MESSAGE_STATUS.FAILED;
				}
			}
			const data = msg.messageObject;

			const addedMessage = await conversationService.addMessageToConversation(c_id, {
				recipient: msg.to,
				message_id: message_id,
				body: {
					body_type:
						data.type === 'text'
							? 'TEXT'
							: data.type === 'contacts'
							? 'CONTACT'
							: data.type === 'location'
							? 'LOCATION'
							: 'MEDIA',
					media_id: ['image', 'video', 'document', 'audio', 'MEDIA'].includes(data.type)
						? data[data.type]?.id
						: undefined,
					text: data.text,
					contacts: data.contacts,
					location: data.location,
				},
				scheduled_by: {
					id: msg.scheduler_id,
					name: msg.scheduler_type,
				},
				failed_at,
				failed_reason,
				status,
			});

			if (addedMessage && msg.scheduler_type === BroadcastDB_name) {
				BroadcastService.updateBroadcastMessageId(msg.scheduler_id, {
					prev_id: msg._id,
					new_id: addedMessage._id,
				});
			}
			msg.remove();
		});
	}

	public static async sendScheduledInteractiveMessages() {
		if (!IS_PRODUCTION) return;
		let docs;
		try {
			docs = await ScheduledMessageDB.find({
				sendAt: { $lte: new Date() },
				status: MESSAGE_STATUS.PENDING,
				message_type: 'interactive',
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
			const conversationService = new ConversationService(msg.linked_to, msg.device_id);
			const userService = new UserService(msg.linked_to);

			const c_id = await conversationService.createConversation(msg.to);

			let failed_at: Date | undefined = undefined;
			let failed_reason: string | undefined = undefined;
			let status = MESSAGE_STATUS.PROCESSING;
			let message_id: string | undefined = undefined;

			if (userService.walletBalance < userService.markupPrice) {
				failed_at = DateUtils.getMomentNow().toDate();
				failed_reason = 'Insufficient balance';
				status = MESSAGE_STATUS.FAILED;
			} else {
				try {
					const { data } = await MetaAPI(msg.device_id.accessToken).post(
						`${msg.device_id.phoneNumberId}/messages`,
						{
							messaging_product: 'whatsapp',
							to: msg.to,
							recipient_type: 'individual',
							type: 'interactive',
							interactive: msg.messageObject.interactive,
						}
					);
					message_id = data.messages[0].id;
					userService.deductCredit(1);
				} catch (err) {
					if (axios.isAxiosError(err)) {
						failed_reason = JSON.stringify(err.response?.data ?? '') as string;
					} else {
						failed_reason = (err as any).message as string;
					}
					failed_at = DateUtils.getMomentNow().toDate();
					status = MESSAGE_STATUS.FAILED;
				}
			}
			const header = extractInteractiveHeader(msg.messageObject.interactive);
			const body = extractInteractiveBody(msg.messageObject.interactive);
			const footer = extractInteractiveFooter(msg.messageObject.interactive);
			const buttons = extractInteractiveButtons(msg.messageObject.interactive);

			const addedMessage = await conversationService.addMessageToConversation(c_id, {
				recipient: msg.to,
				message_id: message_id,
				...(header ? { ...header } : {}),
				...(body ? { body: { body_type: 'TEXT', text: body } } : {}),
				...(footer ? { footer_content: footer } : {}),
				...(buttons ? { buttons } : {}),
				scheduled_by: {
					id: msg.scheduler_id,
					name: msg.scheduler_type,
				},
				failed_at,
				failed_reason,
				status,
			});

			if (addedMessage && msg.scheduler_type === ChatBotFlowDB_name) {
				ChatBotService.updateMessageId(msg.scheduler_id, {
					prev_id: msg._id,
					new_id: addedMessage._id,
					meta_message_id: message_id,
				});
			}
			msg.remove();
		});
	}

	public async pendingTodayCount() {
		const start = DateUtils.getMomentNow().startOf('day').toDate();
		const end = DateUtils.getMomentNow().endOf('day').toDate();

		return ScheduledMessageDB.countDocuments({
			linked_to: this.account._id,
			device_id: this.deviceId,
			sendAt: { $gte: start, $lte: end },
			status: MESSAGE_STATUS.PENDING,
		});
	}
}
