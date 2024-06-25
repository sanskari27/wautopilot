import { Types } from 'mongoose';
import { BroadcastDB, ConversationMessageDB, ScheduledMessageDB } from '../../mongo';
import { BroadcastDB_name } from '../../mongo/repo/Broadcast';
import IAccount from '../../mongo/types/account';
import IWhatsappLink from '../../mongo/types/whatsapplink';
import { BROADCAST_STATUS, MESSAGE_STATUS } from '../config/const';
import DateUtils from '../utils/DateUtils';
import TimeGenerator from '../utils/TimeGenerator';
import SchedulerService from './scheduler';
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
	public constructor(account: IAccount, whatsappLink: IWhatsappLink) {
		super(account, whatsappLink);
	}

	public async fetchReports() {
		const campaigns = await BroadcastDB.aggregate([
			{ $match: { linked_to: this.account._id, device_id: this.deviceId } },
			{
				$sort: {
					createdAt: -1,
				},
			},
			{
				$lookup: {
					from: ScheduledMessageDB.collection.name, // Name of the OtherModel collection
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
					template_name: { $first: '$template_name' },
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
							$cond: {
								if: {
									$or: [
										{ $eq: ['$messagesInfo.status', MESSAGE_STATUS.PROCESSING] },
										{ $eq: ['$messagesInfo.status', MESSAGE_STATUS.PENDING] },
									],
								},
								then: 1,
								else: 0,
							},
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
					template_name: 1,
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
				template_name: message.template_name as string,
				status: message.status as string,
				sent: message.sent as number,
				failed: message.failed as number,
				pending: message.pending as number,
				createdAt: DateUtils.format(message.createdAt, 'DD-MM-YYYY HH:mm') as string,
				isPaused: message.isPaused as boolean,
			}));
	}

	public async generateBroadcastReport(broadcast_id: Types.ObjectId) {
		const broadcast = await BroadcastDB.findOne({
			_id: broadcast_id,
			linked_to: this.account._id,
			device_id: this.deviceId,
		});
		if (!broadcast) {
			return [];
		}

		const messages = await ScheduledMessageDB.aggregate([
			{ $match: { broadcast_id: broadcast._id } },
			{
				$lookup: {
					from: ConversationMessageDB.collection.name,
					localField: 'message_id',
					foreignField: 'message_id',
					as: 'message',
				},
			},
			// extract the first element if it exists
			{ $unwind: { path: '$message', preserveNullAndEmptyArrays: true } },
			{
				$addFields: {
					text: {
						$cond: {
							if: {
								$eq: ['$message.body.body_type', 'TEXT'],
							},
							then: '$message.body.text',
							else: '',
						},
					},
				},
			},
			{
				$project: {
					_id: 0,
					to: 1,
					status: 1,
					sendAt: 1,
					text: 1,
					template_name: '$messageObject.template_name',
					sent_at: 1,
					read_at: 1,
					delivered_at: 1,
					failed_at: 1,
					failed_reason: 1,
				},
			},
		]);

		return messages.map((message) => ({
			to: message.to as string,
			status: message.status as string,
			sendAt: DateUtils.format(message.sendAt, 'DD-MM-YYYY HH:mm') as string,
			text: message.text as string,
			template_name: message.template_name as string,
			sent_at: DateUtils.format(message.sent_at, 'DD-MM-YYYY HH:mm') as string,
			read_at: message.read_at ? DateUtils.format(message.read_at, 'DD-MM-YYYY HH:mm') : '',
			delivered_at: message.delivered_at
				? DateUtils.format(message.delivered_at, 'DD-MM-YYYY HH:mm')
				: '',
			failed_at: message.failed_at ? DateUtils.format(message.failed_at, 'DD-MM-YYYY HH:mm') : '',
			failed_reason: message.failed_reason as string,
			description: broadcast.description as string,
		}));
	}

	public async startBroadcast(
		broadcast: Broadcast,
		options: InstantBroadcastOptions | ScheduledBroadcastOptions
	) {
		const schedulerService = new SchedulerService(this.account, this.device);
		const broadcastDoc = await BroadcastDB.create({
			linked_to: this.account._id,
			device_id: this.deviceId,
			template_id: broadcast.template_id,
			template_name: broadcast.template_name,
			name: broadcast.name,
			description: broadcast.description,
			broadcast_type: options.broadcast_type,
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

			return await schedulerService.schedule(to, messageObject, {
				scheduler_id: broadcastDoc._id,
				scheduler_type: BroadcastDB_name,
				sendAt,
				message_type: 'template',
			});
		});

		const message_ids = await Promise.all(messages);

		await BroadcastDB.updateOne({ _id: broadcastDoc._id }, { messages: message_ids });
	}

	public async pauseBroadcast(broadcast_id: Types.ObjectId) {
		try {
			const campaign = await BroadcastDB.findById(broadcast_id);
			if (!campaign) {
				return;
			}
			await ScheduledMessageDB.updateMany(
				{ _id: campaign.messages, status: MESSAGE_STATUS.PENDING },
				{
					$set: {
						status: MESSAGE_STATUS.PAUSED,
					},
				}
			);
			campaign.status = BROADCAST_STATUS.PAUSED;
			await campaign.save();
		} catch (err) {}
	}

	async resumeBroadcast(campaign_id: Types.ObjectId) {
		try {
			const campaign = await BroadcastDB.findById(campaign_id);
			if (!campaign) {
				return;
			}

			const timeGenerator = new TimeGenerator({
				startDate:
					campaign.broadcast_type === 'scheduled'
						? campaign.startDate
						: DateUtils.getDate('YYYY-MM-DD'),
				startTime: campaign.broadcast_type === 'scheduled' ? campaign.startTime : '00:01',
				endTime: campaign.broadcast_type === 'scheduled' ? campaign.endTime : '23:59',
				daily_count:
					campaign.broadcast_type === 'scheduled'
						? campaign.daily_messages_count
						: campaign.messages.length,
			});

			const messages = await ScheduledMessageDB.find({
				_id: campaign.messages,
				status: MESSAGE_STATUS.PAUSED,
			});

			messages.forEach(async (msg) => {
				msg.sendAt = timeGenerator.next(
					campaign.broadcast_type === 'scheduled' ? undefined : 5
				).value;
				msg.status = MESSAGE_STATUS.PENDING;
				await msg.save();
			});
			campaign.status = BROADCAST_STATUS.ACTIVE;
			await campaign.save();
		} catch (err) {}
	}

	async resendBroadcast(campaign_id: Types.ObjectId) {
		try {
			const campaign = await BroadcastDB.findById(campaign_id);
			if (!campaign) {
				return;
			}

			const timeGenerator = new TimeGenerator({
				startDate:
					campaign.broadcast_type === 'scheduled'
						? campaign.startDate
						: DateUtils.getDate('YYYY-MM-DD'),
				startTime: campaign.broadcast_type === 'scheduled' ? campaign.startTime : '00:01',
				endTime: campaign.broadcast_type === 'scheduled' ? campaign.endTime : '23:59',
				daily_count:
					campaign.broadcast_type === 'scheduled'
						? campaign.daily_messages_count
						: campaign.messages.length,
			});

			const messages = await ScheduledMessageDB.find({
				_id: campaign.messages,
				status: MESSAGE_STATUS.FAILED,
			});

			messages.forEach(async (msg) => {
				msg.sendAt = timeGenerator.next(
					campaign.broadcast_type === 'scheduled' ? undefined : 5
				).value;
				msg.status = MESSAGE_STATUS.PENDING;
				await msg.save();
			});
			campaign.status = BROADCAST_STATUS.ACTIVE;
			await campaign.save();
		} catch (err) {}
	}

	async deleteBroadcast(campaign_id: Types.ObjectId) {
		try {
			const campaign = await BroadcastDB.findById(campaign_id);
			if (!campaign) {
				return;
			}

			await ScheduledMessageDB.deleteMany({ _id: campaign.messages });
			await campaign.delete();
		} catch (err) {
			return;
		}
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

		await ScheduledMessageDB.updateOne(
			{
				message_id: msgID,
			},
			details
		);
	}
}
