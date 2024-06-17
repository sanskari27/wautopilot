import axios from 'axios';
import Logger from 'n23-logger';
import { BroadcastDB, BroadcastMessageDB } from '../../mongo';
import IAccount from '../../mongo/types/account';
import IWhatsappLink from '../../mongo/types/whatsapplink';
import MetaAPI from '../config/MetaAPI';
import { BROADCAST_STATUS, MESSAGE_STATUS } from '../config/const';
import DateUtils from '../utils/DateUtils';
import { extractBody, extractButtons, extractFooter, extractHeader } from '../utils/MessageHelper';
import TimeGenerator from '../utils/TimeGenerator';
import ConversationService from './conversation';
import TemplateService from './templates';
import WhatsappLinkService from './whatsappLink';

type Broadcast = {
	name: string;
	description: string;
	template_id: string;
	template_name: string;
	messages: {
		to: string;
		messageObject: {
			[key: string]: unknown;
		};
	}[];
};

type InstantBroadcastOptions = {
	broadcast_type: 'instant';
};

type ScheduledBroadcastOptions = {
	broadcast_type: 'scheduled';
	startDate: string;
	startTime: string;
	endTime: string;
	daily_messages_count: number;
};

export default class BroadcastService extends WhatsappLinkService {
	private whatsappLink: IWhatsappLink;
	public constructor(account: IAccount, whatsappLink: IWhatsappLink) {
		super(account);
		this.whatsappLink = whatsappLink;
	}

	public async fetchReports() {
		const campaigns = await BroadcastDB.aggregate([
			{ $match: { linked_to: this.account._id, device_id: this.whatsappLink._id } },
			{
				$sort: {
					createdAt: -1,
				},
			},
			{
				$lookup: {
					from: BroadcastMessageDB.collection.name, // Name of the OtherModel collection
					localField: 'messages',
					foreignField: '_id',
					as: 'messagesInfo',
				},
			},
			{
				$unwind: '$messagesInfo', // If messages is an array, unwind it to separate documents
			},
			{
				$group: {
					_id: '$_id', // Group by the campaign ID
					name: { $first: '$name' },
					description: { $first: '$description' },
					status: { $first: '$status' },
					startTime: { $first: '$startTime' },
					endTime: { $first: '$endTime' },
					daily_messages_count: { $first: '$daily_messages_count' },
					createdAt: { $first: '$createdAt' },
					sent: {
						$sum: {
							$cond: {
								if: {
									$and: [
										{ $ne: ['$messagesInfo.status', MESSAGE_STATUS.PROCESSING] },
										{ $ne: ['$messagesInfo.status', MESSAGE_STATUS.FAILED] },
										{ $ne: ['$messagesInfo.status', MESSAGE_STATUS.PENDING] },
									],
								},
								then: 1,
								else: 0,
							},
						},
					},
					failed: {
						$sum: { $cond: [{ $eq: ['$messagesInfo.status', MESSAGE_STATUS.FAILED] }, 1, 0] },
					},
					pending: {
						$sum: {
							$cond: [{ $in: ['$messagesInfo.status', [MESSAGE_STATUS.PENDING]] }, 1, 0],
						},
					},
				},
			},
			{
				$project: {
					broadcast_id: '$_id',
					_id: 0,
					name: 1,
					description: 1,
					status: 1,
					sent: 1,
					failed: 1,
					pending: 1,
					createdAt: 1,
					startTime: 1,
					endTime: 1,
					isPaused: { $eq: ['$status', BROADCAST_STATUS.PAUSED] },
				},
			},
		]);

		return campaigns
			.sort((a, b) =>
				DateUtils.getMoment(a.createdAt).isAfter(DateUtils.getMoment(b.createdAt)) ? -1 : 1
			)
			.map((message: { [key: string]: any }) => ({
				broadcast_id: message.broadcast_id as string,
				name: message.name as string,
				description: message.description as string,
				status: message.status as string,
				sent: message.sent as number,
				failed: message.failed as number,
				pending: message.pending as number,
				createdAt: DateUtils.format(message.createdAt, 'DD-MM-YYYY HH:mm') as string,
				isPaused: message.isPaused as boolean,
			}));
	}

	public async startBroadcast(
		broadcast: Broadcast,
		options: InstantBroadcastOptions | ScheduledBroadcastOptions
	) {
		const broadcastDoc = await BroadcastDB.create({
			linked_to: this.account._id,
			device_id: this.whatsappLink._id,
			template_id: broadcast.template_id,
			template_name: broadcast.template_name,
			name: broadcast.name,
			description: broadcast.description,
			startDate: options.broadcast_type === 'scheduled' ? options.startDate : undefined,
			startTime: options.broadcast_type === 'scheduled' ? options.startTime : undefined,
			endTime: options.broadcast_type === 'scheduled' ? options.endTime : undefined,
			daily_messages_count:
				options.broadcast_type === 'scheduled'
					? options.daily_messages_count
					: broadcast.messages.length,
		});

		const timeGenerator = new TimeGenerator({
			startDate:
				options.broadcast_type === 'scheduled'
					? options.startDate
					: DateUtils.getDate('YYYY-MM-DD'),
			startTime: options.broadcast_type === 'scheduled' ? options.startTime : '00:01',
			endTime: options.broadcast_type === 'scheduled' ? options.endTime : '23:59',
			daily_count:
				options.broadcast_type === 'scheduled'
					? options.daily_messages_count
					: broadcast.messages.length,
		});

		const messages = broadcast.messages.map(async ({ messageObject, to }) => {
			const sendAt = timeGenerator.next(
				options.broadcast_type === 'scheduled' ? undefined : 5
			).value;

			const message = await BroadcastMessageDB.create({
				linked_to: this.account._id,
				device_id: this.whatsappLink._id,
				broadcast_id: broadcastDoc._id,
				to,
				messageObject,
				sendAt,
			});

			return message._id;
		});

		const message_ids = await Promise.all(messages);

		await BroadcastDB.updateOne({ _id: broadcastDoc._id }, { messages: message_ids });
	}

	public static async sendScheduledBroadcastMessage() {
		let docs;
		try {
			docs = await BroadcastMessageDB.find({
				sendAt: { $lte: new Date() },
				status: MESSAGE_STATUS.PENDING,
			}).populate<{
				device_id: IWhatsappLink;
				linked_to: IAccount;
			}>('device_id linked_to');
		} catch (err) {
			return;
		}
		const message_ids = docs.map((msg) => msg._id);

		await BroadcastMessageDB.updateMany(
			{ _id: { $in: message_ids } },
			{
				$set: {
					status: MESSAGE_STATUS.PROCESSING,
				},
			}
		);

		docs.forEach(async (msg) => {
			try {
				const { data } = await MetaAPI.post(
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
					},
					{
						headers: {
							Authorization: `Bearer ${msg.device_id.accessToken}`,
						},
					}
				);
				msg.message_id = data.messages[0].id;
				msg.save();
			} catch (err) {
				if (axios.isAxiosError(err)) {
					Logger.info('Error sending broadcast message', err.response?.data as string);
				}

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
				await conversationService.addMessageToConversation(c_id, {
					recipient: msg.to,
					message_id: msg.message_id,
					...(header ? { ...header } : {}),
					body: {
						body_type: 'TEXT',
						text: body!,
					},
					...(footer ? { footer_content: footer } : {}),
					...(buttons ? { buttons } : {}),
				});
			}
		});
	}

	public static async updateStatus(
		msgID: string,
		status: string,
		timestamp: number,
		error?: string
	) {
		const details = {} as Record<string, unknown>;
		if (status === 'sent') {
			details.sent_at = DateUtils.fromUnixTime(timestamp).toDate();
			details.status = MESSAGE_STATUS.SENT;
		} else if (status === 'read') {
			details.read_at = DateUtils.fromUnixTime(timestamp).toDate();
			details.status = MESSAGE_STATUS.READ;
		} else if (status === 'delivered') {
			details.delivered_at = DateUtils.fromUnixTime(timestamp).toDate();
			details.status = MESSAGE_STATUS.DELIVERED;
		} else if (status === 'failed') {
			details.failed_at = DateUtils.fromUnixTime(timestamp).toDate();
			details.status = MESSAGE_STATUS.FAILED;
			details.failed_reason = error;
		}

		await BroadcastMessageDB.updateOne(
			{
				message_id: msgID,
			},
			details
		);
	}
}
