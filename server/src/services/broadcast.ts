import BroadcastDB from '../../mongo/repo/Broadcast';
import BroadcastMessageDB from '../../mongo/repo/BroadcastMessage';
import IAccount from '../../mongo/types/account';
import IWhatsappLink from '../../mongo/types/whatsapplink';
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
}
