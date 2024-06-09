import axios from 'axios';
import Logger from 'n23-logger';
import BroadcastDB from '../../mongo/repo/Broadcast';
import BroadcastMessageDB from '../../mongo/repo/BroadcastMessage';
import IAccount from '../../mongo/types/account';
import IWhatsappLink from '../../mongo/types/whatsapplink';
import MetaAPI from '../config/MetaAPI';
import { MESSAGE_STATUS } from '../config/const';
import DateUtils from '../utils/DateUtils';
import TimeGenerator from '../utils/TimeGenerator';
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
			startDate: options.broadcast_type === 'scheduled' ? options.startDate : undefined,
			startTime: options.broadcast_type === 'scheduled' ? options.startTime : undefined,
			endTime: options.broadcast_type === 'scheduled' ? options.endTime : undefined,
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
		const docs = await BroadcastMessageDB.find({
			sendAt: { $lte: new Date() },
			status: MESSAGE_STATUS.PENDING,
		}).populate<{
			device_id: IWhatsappLink;
		}>('device_id');

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
		} else if (status === 'read') {
			details.read_at = DateUtils.fromUnixTime(timestamp).toDate();
		} else if (status === 'delivered') {
			details.delivered_at = DateUtils.fromUnixTime(timestamp).toDate();
		} else if (status === 'failed') {
			details.failed_at = DateUtils.fromUnixTime(timestamp).toDate();
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
