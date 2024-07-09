import { Types } from 'mongoose';
import { ConversationDB, ConversationMessageDB, PhoneBookDB } from '../../mongo';
import IAccount from '../../mongo/types/account';
import IConversation from '../../mongo/types/conversation';
import IConversationMessage from '../../mongo/types/conversationMessage';
import IWhatsappLink from '../../mongo/types/whatsappLink';
import { MESSAGE_STATUS } from '../config/const';
import SocketServer from '../socket';
import DateUtils from '../utils/DateUtils';
import { filterUndefinedKeys } from '../utils/ExpressUtils';
import PhoneBookService from './phonebook';
import WhatsappLinkService from './whatsappLink';

function processConversationDocs(
	docs: (IConversation & {
		labels: string[];
	})[]
) {
	return docs.map((doc) => ({
		_id: doc._id,
		recipient: doc.recipient,
		profile_name: doc.profile_name ?? '',
		origin: doc.origin ?? '',
		labels: doc.labels ?? [],
	}));
}

function processConversationMessages(docs: Partial<IConversationMessage>[]) {
	return docs.map((doc) => ({
		_id: doc._id!,
		recipient: doc.recipient,
		conversation_id: doc.conversation_id,
		message_id: doc.message_id,
		header_type: doc.header_type,
		header_content_source: doc.header_content_source,
		header_content: doc.header_content,
		body: doc.body,
		footer_content: doc.footer_content,
		buttons: doc.buttons,
		received_at: doc.received_at,
		delivered_at: doc.delivered_at,
		read_at: doc.read_at,
		sent_at: doc.sent_at,
		failed_at: doc.failed_at,
		failed_reason: doc.failed_reason,
		seen_at: doc.seen_at,
		status: doc.status,
		context: doc.context,
		labels: doc.labels,
		sender: doc.sender,
	}));
}

export default class ConversationService extends WhatsappLinkService {
	public constructor(account: IAccount, whatsappLink: IWhatsappLink) {
		super(account, whatsappLink);
	}

	public async createConversation(recipient: string, name?: string) {
		try {
			const doc = await ConversationDB.create({
				linked_to: this.userId,
				device_id: this.deviceId,
				recipient,
			});

			const phoneBookService = new PhoneBookService(this.account);
			const contact = await phoneBookService.findRecordByPhone(recipient);
			if (!contact) {
				phoneBookService.addRecords([
					{
						phone_number: recipient,
						first_name: name,
						labels: ['UNSAVED'],
					},
				]);
			}

			return doc._id;
		} catch (err) {
			const doc = await ConversationDB.findOne({
				linked_to: this.userId,
				device_id: this.deviceId,
				recipient,
			});
			return doc!._id;
		}
	}

	public async updateConversation(
		recipient: string,
		details: {
			profile_name: string;
			meta_conversation_id: string;
			expiration_timestamp: Date;
			origin: string;
		}
	) {
		await ConversationDB.updateMany(
			{
				linked_to: this.userId,
				recipient,
			},
			{
				$set: details,
			}
		);
	}

	public async findRecipientByConversation(id: Types.ObjectId) {
		const doc = await ConversationDB.findOne({
			linked_to: this.userId,
			_id: id,
		});
		if (!doc) return null;
		return doc.recipient;
	}

	public async addMessageToConversation(
		conversation_id: Types.ObjectId,
		details: {
			recipient: string;
			message_id?: string;
			header_type?: string;
			header_content_source?: string;
			header_content?: string;
			body?: Partial<IConversationMessage['body']>;
			footer_content?: string;
			buttons?: IConversationMessage['buttons'];
			received_at?: Date;
			status?: MESSAGE_STATUS;
			context?: {
				from?: string;
				id: string;
			};
			scheduled_by?: {
				id: Types.ObjectId;
				name: string;
			};
			failed_at?: Date;
			failed_reason?: string;
			sender?: {
				id: Types.ObjectId;
				name: string;
			};
		}
	) {
		try {
			const doc = await ConversationMessageDB.create({
				linked_to: this.userId,
				device_id: this.deviceId,
				conversation_id,
				status: details.status ?? MESSAGE_STATUS.PROCESSING,
				...filterUndefinedKeys(details),
			});

			await ConversationDB.updateOne(
				{
					_id: conversation_id,
				},
				{
					$push: {
						messages: doc._id,
					},
					$set: {
						last_message_at: DateUtils.getMomentNow().toDate(),
					},
				}
			);

			const data = processConversationMessages([doc])[0];
			SocketServer.getInstance().sendMessage(conversation_id.toString(), data);
			SocketServer.getInstance().sendNewMessageNotification(
				this.userId.toString(),
				conversation_id.toString()
			);

			return data;
		} catch (err) {
			return null;
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

		await ConversationMessageDB.updateOne(
			{
				message_id: msgID,
			},
			details
		);
		const doc = await ConversationMessageDB.findOne({
			message_id: msgID,
		});
		if (!doc) return;

		const data = processConversationMessages([doc])[0];
		SocketServer.getInstance().sendMessageUpdated(doc.conversation_id.toString(), data);
	}

	public static async updateConversationDetails(
		recipient: string,
		details: Partial<{
			meta_conversation_id: string;
			conversationExpiry: number;
			origin: string;
		}>
	) {
		await ConversationDB.updateOne(
			{
				recipient: recipient,
			},
			{
				$set: filterUndefinedKeys(details),
			}
		);
	}

	public async updateConversationDetails(
		recipient: string,
		details: Partial<{
			profile_name: string;
		}>
	) {
		await ConversationDB.updateOne(
			{
				recipient: recipient,
				linked_to: this.userId,
				device_id: this.deviceId,
			},
			{
				$set: filterUndefinedKeys(details),
			}
		);
	}

	public async markMessageRead(message_id: string) {
		await ConversationMessageDB.updateOne(
			{
				linked_to: this.userId,
				device_id: this.deviceId,
				message_id,
			},
			{
				$set: {
					read_at: new Date(),
					status: MESSAGE_STATUS.READ,
				},
			}
		);
	}

	public async fetchConversations(
		labels: string[] = [],
		opts?: {
			agent_id?: Types.ObjectId;
		}
	) {
		const phoneBookService = new PhoneBookService(this.account);
		const _recipients = await phoneBookService.fetchRecords({
			page: 1,
			limit: 99999999,
			labels,
		});

		const recipients = _recipients.map((recipient) => recipient.phone_number);

		const docs = await ConversationDB.aggregate([
			{
				$match: {
					linked_to: this.userId,
					device_id: this.deviceId,
					...(labels.length > 0 ? { recipient: { $in: recipients } } : {}),
					...(opts?.agent_id ? { assigned_to: opts.agent_id } : {}),
				},
			},
			{
				$lookup: {
					from: PhoneBookDB.collection.name,
					localField: 'recipient',
					foreignField: 'phone_number',
					as: 'recipientDetails',
				},
			},
			{
				$unwind: {
					path: '$recipientDetails',
					preserveNullAndEmptyArrays: true,
				},
			},
			// if recipientDetails is not empty array,  get labels from first element of recipientDetails or set it to empty array
			{
				$addFields: {
					recipientDetails: {
						$cond: {
							if: { $ne: ['$recipientDetails', []] },
							then: '$recipientDetails',
							else: [],
						},
					},
				},
			},
			{
				$addFields: {
					labels: {
						$cond: {
							if: { $ne: ['$recipientDetails', []] },
							then: '$recipientDetails.labels',
							else: [],
						},
					},
				},
			},
			{
				$addFields: {
					saved_name: {
						$cond: {
							if: { $ne: ['$recipientDetails', {}] },
							then: {
								$cond: {
									if: { $eq: ['$recipientDetails.first_name', ''] },
									then: '$profile_name',
									else: {
										$concat: [
											{ $ifNull: ['$recipientDetails.first_name', ''] },
											' ',
											{ $ifNull: ['$recipientDetails.last_name', ''] },
										],
									},
								},
							},
							else: '$profile_name',
						},
					},
				},
			},
			{
				$group: {
					_id: '$_id',
					linked_to: { $first: '$linked_to' },
					device_id: { $first: '$device_id' },
					recipient: { $first: '$recipient' },
					profile_name: { $first: '$saved_name' },
					recipientDetails: { $first: '$recipientDetails' },
					saved_name: { $first: '$saved_name' },
					labels: { $first: '$labels' },
					last_message_at: { $first: '$last_message_at' },
				},
			},
			{
				$sort: {
					last_message_at: -1,
				},
			},
		]);

		return processConversationDocs(docs);
	}

	public async fetchConversationMessages(
		conversation_id: Types.ObjectId,
		opts: {
			page: number;
			limit: number;
		} = {
			page: 1,
			limit: 50,
		}
	) {
		const docs = await ConversationMessageDB.find({
			linked_to: this.userId,
			device_id: this.deviceId,
			conversation_id,
		})
			.sort({ createdAt: -1 })
			.skip((opts.page - 1) * opts.limit)
			.limit(opts.limit);

		const _docs = docs.sort(
			(a, b) =>
				(b.received_at ?? b.sent_at ?? b.createdAt).getTime() -
				(a.received_at ?? a.sent_at ?? a.createdAt).getTime()
		);

		return processConversationMessages(_docs);
	}

	public async fetchConversationExpiry(id: Types.ObjectId) {
		const doc = await ConversationMessageDB.find({
			linked_to: this.userId,
			device_id: this.deviceId,
			conversation_id: id,
			received_at: { $exists: true },
		})
			.sort({ createdAt: -1 })
			.limit(1);

		if (doc.length === 0) return 'EXPIRED';
		const time = DateUtils.getMoment(doc[0].received_at).add(24, 'hours');
		const time_diff = time.diff(DateUtils.getMomentNow(), 'seconds');
		if (time_diff < 0) return 'EXPIRED';
		return time_diff;
	}

	public async fetchMessagesLabels(id: Types.ObjectId) {
		const records = await ConversationMessageDB.find({
			linked_to: this.userId,
			conversation_id: id,
		});

		const labels = records.reduce<Set<string>>((acc, record) => {
			record.labels.forEach((label) => acc.add(label));
			return acc;
		}, new Set<string>());

		return Array.from(labels);
	}

	public async fetchMessagesByLabel(label: string) {
		const records = await ConversationMessageDB.find({
			linked_to: this.userId,
			labels: label,
		});

		return processConversationMessages(records);
	}

	public async assignLabelToMessage(id: Types.ObjectId, labels: string[]) {
		await ConversationMessageDB.updateOne(
			{
				_id: id,
			},
			{
				$set: {
					labels,
				},
			}
		);
	}

	public async getConversationMessageByMetaId(message_id: string) {
		const doc = await ConversationMessageDB.findOne({
			linked_to: this.userId,
			device_id: this.deviceId,
			message_id,
		});
		return doc;
	}

	public async monthlyStartedConversations() {
		const start = DateUtils.getMomentNow().subtract(12, 'months').startOf('month').toDate();
		const end = DateUtils.getMomentNow().endOf('month').toDate();

		const allMonths = [];
		let currentMonth = new Date(start);
		while (currentMonth <= end) {
			allMonths.push({
				month: currentMonth.getMonth() + 1, // Months are 0-indexed in JavaScript Date
				year: currentMonth.getFullYear(),
				count: 0,
			});
			currentMonth.setMonth(currentMonth.getMonth() + 1);
		}

		const docs = await ConversationDB.aggregate([
			{
				$match: {
					linked_to: this.userId,
					device_id: this.deviceId,
					createdAt: {
						$gte: start,
						$lte: end,
					},
				},
			},
			{
				$group: {
					_id: {
						month: { $month: '$createdAt' },
						year: { $year: '$createdAt' },
					},
					count: {
						$sum: 1,
					},
				},
			},
		]);

		// Convert docs to a map for easy lookup
		const docsMap = new Map(docs.map((doc) => [`${doc._id.year}-${doc._id.month}`, doc.count]));

		// Merge the results with all months
		const result = allMonths.map((month) => {
			const key = `${month.year}-${month.month}`;
			return {
				month: month.month,
				year: month.year,
				count: docsMap.get(key) || 0,
			};
		});
		return result;
	}

	public async dailySentMessages() {
		const start = DateUtils.getMomentNow().startOf('month').toDate();
		const end = DateUtils.getMomentNow().endOf('month').toDate();

		const daysInMonth = DateUtils.getMomentNow().daysInMonth();

		const allDaysInMonth = Array.from({ length: daysInMonth }, (_, i) => i + 1);

		const docs = await ConversationMessageDB.aggregate([
			{
				$match: {
					linked_to: this.userId,
					device_id: this.deviceId,
					sent_at: {
						$gte: start,
						$lte: end,
					},
				},
			},
			{
				$group: {
					_id: {
						$dayOfMonth: '$sent_at',
					},
					month: {
						$first: {
							$month: '$sent_at',
						},
					},
					count: {
						$sum: 1,
					},
				},
			},
		]);

		// Convert aggregation results into a map for easier lookup
		const docsMap = new Map(docs.map((doc) => [doc._id, doc.count]));

		// Create the final result array, ensuring each day is accounted for
		const result = allDaysInMonth.map((day) => ({
			day,
			month: DateUtils.getMomentNow().month() + 1, // Month is 0-indexed in Moment.js
			count: docsMap.get(day) || 0,
		}));

		return result;
	}

	public async assignConversationToAgent(
		agent_id: Types.ObjectId,
		c_id: Types.ObjectId | Types.ObjectId[]
	) {
		await ConversationDB.updateMany(
			{
				linked_to: this.userId,
				device_id: this.deviceId,
				_id: Array.isArray(c_id) ? { $in: c_id } : c_id,
			},
			{
				$set: {
					assigned_to: agent_id,
				},
			}
		);
	}

	public async assignNumbersToAgent(agent_id: Types.ObjectId, numbers: string[]) {
		await ConversationDB.updateMany(
			{
				linked_to: this.userId,
				device_id: this.deviceId,
				recipient: { $in: numbers },
			},
			{
				$set: {
					assigned_to: agent_id,
				},
			}
		);
	}

	public async transferConversations(
		agent_id: Types.ObjectId,
		assigned_to: Types.ObjectId | string | undefined
	) {
		await ConversationDB.updateMany(
			{
				linked_to: this.userId,
				device_id: this.deviceId,
				assigned_to: agent_id,
			},
			{
				$set: {
					assigned_to: assigned_to,
				},
			}
		);
	}

	public async removeConversationFromAgent(c_id: Types.ObjectId) {
		await ConversationDB.updateOne(
			{
				linked_to: this.userId,
				device_id: this.deviceId,
				_id: c_id,
			},
			{
				$set: {
					assigned_to: null,
				},
			}
		);
	}
}
