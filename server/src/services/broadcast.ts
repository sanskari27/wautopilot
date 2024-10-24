import { Types } from 'mongoose';
import {
	BroadcastDB,
	ConversationMessageDB,
	RecurringBroadcastDB,
	ScheduledMessageDB,
} from '../../mongo';
import { BroadcastDB_name } from '../../mongo/repo/Broadcast';
import { RecurringBroadcastDB_name } from '../../mongo/repo/RecurringBroadcast';
import IAccount from '../../mongo/types/account';
import IRecurringBroadcast from '../../mongo/types/recurringBroadcast';
import IWhatsappLink from '../../mongo/types/whatsappLink';
import { BROADCAST_STATUS, MESSAGE_STATUS } from '../config/const';
import { CustomError } from '../errors';
import COMMON_ERRORS from '../errors/common-errors';
import { TemplateMessage } from '../models/message';
import TemplateFactory from '../models/templates/templateFactory';
import DateUtils from '../utils/DateUtils';
import { filterUndefinedKeys } from '../utils/ExpressUtils';
import { extractFormattedMessage, parseToBodyVariables } from '../utils/MessageHelper';
import TimeGenerator from '../utils/TimeGenerator';
import MessageScheduler from './messageScheduler';
import PhoneBookService, { IPhonebookRecord } from './phonebook';
import WhatsappLinkService from './whatsappLink';

type Broadcast = {
	name: string;
	description: string;
	template_id: string;
	template_name: string;
	messages: TemplateMessage[];
};

type RecurringBroadcast = {
	name: string;
	description: string;
	wish_from: string;
	labels: string[];
	template_id: string;
	template_name: string;
	template_header?: {
		type: 'IMAGE' | 'TEXT' | 'VIDEO' | 'DOCUMENT';
		link?: string | undefined;
		media_id?: string | undefined;
		text?:
			| {
					custom_text: string;
					phonebook_data: string;
					variable_from: 'custom_text' | 'phonebook_data';
					fallback_value: string;
			  }[];
	};
	template_body: {
		custom_text: string;
		phonebook_data: string;
		variable_from: 'custom_text' | 'phonebook_data';
		fallback_value: string;
	}[];
	template_carousel?: {
		cards: {
			header: {
				media_id: string;
			};
			body: {
				custom_text: string;
				phonebook_data: string;
				variable_from: 'custom_text' | 'phonebook_data';
				fallback_value: string;
			}[];
			buttons: string[][];
		}[];
	};
	delay: number;
	startTime: string;
	endTime: string;
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

function processRecurringDocs(docs: IRecurringBroadcast[]) {
	return docs.map((doc) => ({
		id: doc._id,
		name: doc.name,
		description: doc.description,
		wish_from: doc.wish_from,
		status: doc.status,
		labels: doc.labels,
		template_id: doc.template_id,
		template_name: doc.template_name,
		template_header: doc.template_header?.type ? doc.template_header : undefined,
		template_body: doc.template_body,
		template_buttons: doc.template_buttons,
		template_carousel: doc.template_carousel,
		delay: doc.delay,
		startTime: doc.startTime,
		endTime: doc.endTime,
	}));
}

export default class BroadcastService extends WhatsappLinkService {
	public constructor(account: IAccount, whatsappLink: IWhatsappLink) {
		super(account, whatsappLink);
	}

	public async listRecurringBroadcasts() {
		const docs = await RecurringBroadcastDB.find({
			linked_to: this.account._id,
			device_id: this.deviceId,
		});
		return processRecurringDocs(docs);
	}

	public async scheduleRecurring(details: RecurringBroadcast) {
		const doc = await RecurringBroadcastDB.create({
			...details,
			linked_to: this.account._id,
			device_id: this.deviceId,
		});
		return processRecurringDocs([doc])[0];
	}

	public async updateRecurringBroadcast(id: Types.ObjectId, details: Partial<RecurringBroadcast>) {
		await RecurringBroadcastDB.updateOne(
			{ _id: id },
			{
				$set: filterUndefinedKeys(details),
			}
		);

		const doc = await RecurringBroadcastDB.findById(id);
		if (!doc) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}
		return processRecurringDocs([doc])[0];
	}

	async toggleRecurringBroadcast(id: Types.ObjectId) {
		const campaign = await RecurringBroadcastDB.findById(id);
		if (!campaign) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}
		campaign.status =
			campaign.status === BROADCAST_STATUS.ACTIVE
				? BROADCAST_STATUS.PAUSED
				: BROADCAST_STATUS.ACTIVE;
		await campaign.save();
		if (campaign.status === BROADCAST_STATUS.PAUSED) {
			await ScheduledMessageDB.updateMany(
				{ scheduler_id: id, status: MESSAGE_STATUS.PENDING },
				{
					$set: {
						status: MESSAGE_STATUS.PAUSED,
					},
				}
			);
		} else {
			await ScheduledMessageDB.updateMany(
				{ scheduler_id: id, status: MESSAGE_STATUS.PAUSED },
				{
					$set: {
						status: MESSAGE_STATUS.PENDING,
					},
				}
			);
		}
		return campaign;
	}

	async deleteRecurringBroadcast(id: Types.ObjectId) {
		const campaign = await RecurringBroadcastDB.findById(id);
		if (!campaign) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}
		await ScheduledMessageDB.deleteMany({ scheduler_id: id });
		await campaign.delete();
		return campaign;
	}

	async rescheduleRecurringBroadcast(id: Types.ObjectId) {
		const broadcast = await RecurringBroadcastDB.findById(id).populate<{
			device_id: IWhatsappLink;
			linked_to: IAccount;
		}>('device_id linked_to');
		if (!broadcast) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}
		const today = DateUtils.getDate('YYYY-MM-DD');

		const phoneBook = new PhoneBookService(broadcast.linked_to);
		const schedulerService = new MessageScheduler(broadcast.linked_to._id, broadcast.device_id._id);

		const template = await TemplateFactory.findByName(broadcast.device_id, broadcast.template_name);
		if (!template) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		const header = template.getHeader();
		const tButtons = template.getURLButtonsWithVariable();
		const tCarousel = template.getCarouselCards();

		const recipients = (
			await phoneBook.fetchRecords({
				page: 1,
				limit: 99999999,
				labels: broadcast.labels,
			})
		).filter((record) => {
			if (!record.phone_number) {
				return false;
			}
			if (
				broadcast.wish_from === 'birthday' &&
				DateUtils.getMoment(record.birthday).format('YYYY-MM-DD') === today
			) {
				return true;
			} else if (
				broadcast.wish_from === 'anniversary' &&
				DateUtils.getMoment(record.anniversary).format('YYYY-MM-DD') === today
			) {
				return true;
			}
			return false;
		});

		const timeGenerator = new TimeGenerator({
			startDate: today,
			startTime: broadcast.startTime,
			endTime: broadcast.endTime,
			daily_count: 99999999,
		});

		const formattedMessages = recipients.map((fields) => {
			const msg = new TemplateMessage(fields.phone_number, template);

			if (header && broadcast.template_header) {
				if (
					header.format !== 'TEXT' &&
					('link' in broadcast.template_header || 'media_id' in broadcast.template_header)
				) {
					msg.setMediaHeader(broadcast.template_header as any);
				} else if (broadcast.template_header.text && header?.example.length > 0) {
					const headerVariables = parseToBodyVariables({
						variables: broadcast.template_header.text,
						fields,
					});
					msg.setTextHeader(headerVariables);
				}
			}

			const bodyVariables = parseToBodyVariables({ variables: broadcast.template_body, fields });
			msg.setBody(bodyVariables);

			if (tButtons.length > 0) {
				msg.setButtons(broadcast.template_buttons);
			}

			if (tCarousel.length > 0 && broadcast.template_carousel) {
				const cards = broadcast.template_carousel.cards.map((card, index) => {
					const bodyVariables = parseToBodyVariables({
						variables: card.body,
						fields: fields || ({} as IPhonebookRecord),
					});
					return {
						header: card.header,
						body: bodyVariables,
						buttons: card.buttons,
					};
				});
				msg.setCarousel(cards);
			}

			return msg;
		});

		formattedMessages.forEach((msg) => {
			const sendAt = timeGenerator.next(5).value;

			schedulerService.scheduleMessage(msg, {
				scheduler_id: broadcast._id,
				scheduler_type: RecurringBroadcastDB_name,
				sendAt,
				formattedMessage: extractFormattedMessage(msg.toObject().template, {
					template: template.buildToSave(),
					type: 'template',
				}),
			});
		});

		return broadcast;
	}

	async fetchRecurringReport(id: Types.ObjectId) {
		const recurringBroadcast = await RecurringBroadcastDB.findOne({
			_id: id,
			linked_to: this.account._id,
			device_id: this.deviceId,
		});

		if (!recurringBroadcast) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		const sentDocs = await ConversationMessageDB.find({
			scheduled_by: {
				id: id,
				name: RecurringBroadcastDB_name,
			},
		});

		const sentMessages = sentDocs.map((doc) => ({
			to: doc.recipient,
			status: doc.status,
			sendAt: DateUtils.format(doc.sendAt, 'DD-MM-YYYY HH:mm'),
			text: doc.body?.body_type === 'TEXT' ? doc.body.text : '',
			template_name: recurringBroadcast.template_name,
			sent_at: DateUtils.format(doc.sent_at, 'DD-MM-YYYY HH:mm'),
			read_at: doc.read_at ? DateUtils.format(doc.read_at, 'DD-MM-YYYY HH:mm') : '',
			delivered_at: doc.delivered_at ? DateUtils.format(doc.delivered_at, 'DD-MM-YYYY HH:mm') : '',
			failed_at: doc.failed_at ? DateUtils.format(doc.failed_at, 'DD-MM-YYYY HH:mm') : '',
			failed_reason: doc.failed_reason,
			description: recurringBroadcast.description,
			createdAt: doc.createdAt,
		}));

		const scheduledDocs = await ScheduledMessageDB.find({
			scheduler_id: id,
			status: MESSAGE_STATUS.PENDING,
		});

		const scheduledMessages = scheduledDocs.map((doc) => ({
			to: doc.to,
			status: doc.status,
			sendAt: DateUtils.format(doc.sendAt, 'DD-MM-YYYY HH:mm'),
			text: '',
			template_name: recurringBroadcast.template_name,
			sent_at: DateUtils.format(doc.sent_at, 'DD-MM-YYYY HH:mm'),
			read_at: doc.read_at ? DateUtils.format(doc.read_at, 'DD-MM-YYYY HH:mm') : '',
			delivered_at: doc.delivered_at ? DateUtils.format(doc.delivered_at, 'DD-MM-YYYY HH:mm') : '',
			failed_at: doc.failed_at ? DateUtils.format(doc.failed_at, 'DD-MM-YYYY HH:mm') : '',
			failed_reason: doc.failed_reason,
			description: recurringBroadcast.description,
			createdAt: doc.createdAt,
		}));

		const allMessages = [...sentMessages, ...scheduledMessages];
		return allMessages.sort((a, b) =>
			DateUtils.getMoment(a.sendAt, 'DD-MM-YYYY HH:mm').isAfter(
				DateUtils.getMoment(b.sendAt, 'DD-MM-YYYY HH:mm')
			)
				? 1
				: -1
		);
	}

	public async fetchBroadcastReports() {
		const campaigns = await BroadcastDB.aggregate([
			{ $match: { linked_to: this.account._id, device_id: this.deviceId } },
			{
				$sort: {
					createdAt: -1,
				},
			},
			{
				$lookup: {
					from: ConversationMessageDB.collection.name, // Ensure this is correct
					localField: '_id',
					foreignField: 'scheduled_by.id',
					as: 'conversationMessages',
				},
			},
			{
				$lookup: {
					from: ScheduledMessageDB.collection.name, // Ensure this is correct
					localField: '_id',
					foreignField: 'scheduler_id',
					as: 'scheduledMessages',
				},
			},
			// No $unwind here, keep both arrays intact
			{
				$group: {
					_id: '$_id', // Group by campaign ID
					name: { $first: '$name' },
					description: { $first: '$description' },
					template_name: { $first: '$template_name' },
					status: { $first: '$status' },
					startTime: { $first: '$startTime' },
					endTime: { $first: '$endTime' },
					daily_messages_count: { $first: '$daily_messages_count' },
					createdAt: { $first: '$createdAt' },
					conversationMessages: { $push: '$conversationMessages' }, // Push all conversation messages
					scheduledMessages: { $push: '$scheduledMessages' }, // Push all scheduled messages
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
					messages: { $concatArrays: ['$conversationMessages', '$scheduledMessages'] },
					createdAt: 1,
					startTime: 1,
					endTime: 1,
					isPaused: { $eq: ['$status', BROADCAST_STATUS.PAUSED] }, // Add paused check
				},
			},
		]);

		return campaigns
			.sort((a, b) =>
				DateUtils.getMoment(a.createdAt).isAfter(DateUtils.getMoment(b.createdAt)) ? -1 : 1
			)
			.map((message: { [key: string]: any }) => {
				const defaultMap = {
					sent: 0,
					failed: 0,
					pending: 0,
				};

				const _itr1 = message.messages[0].reduce((acc: typeof defaultMap, curr: any) => {
					if (
						curr.status === MESSAGE_STATUS.SENT ||
						curr.status === MESSAGE_STATUS.READ ||
						curr.status === MESSAGE_STATUS.DELIVERED
					) {
						acc.sent++;
					} else if (curr.status === MESSAGE_STATUS.FAILED) {
						acc.failed++;
					} else {
						acc.pending++;
					}
					return acc;
				}, defaultMap);
				const { sent, failed, pending } = message.messages[1].reduce(
					(acc: typeof defaultMap, curr: any) => {
						if (
							curr.status === MESSAGE_STATUS.PENDING ||
							curr.status === MESSAGE_STATUS.PAUSED ||
							curr.status === MESSAGE_STATUS.PROCESSING
						) {
							acc.pending++;
						} else if (
							curr.status === MESSAGE_STATUS.SENT ||
							curr.status === MESSAGE_STATUS.READ ||
							curr.status === MESSAGE_STATUS.DELIVERED
						) {
							acc.sent++;
						} else if (curr.status === MESSAGE_STATUS.FAILED) {
							acc.failed++;
						} else {
							acc.pending++;
						}
						return acc;
					},
					_itr1
				);

				return {
					broadcast_id: message.broadcast_id as string,
					name: message.name as string,
					description: message.description as string,
					template_name: message.template_name as string,
					status: message.status as string,
					sent,
					failed,
					pending,
					createdAt: DateUtils.format(message.createdAt, 'MMM Do, YYYY hh:mm A') as string,
					isPaused: message.isPaused as boolean,
				};
			});
	}

	public async getBroadcastName(broadcast_id: Types.ObjectId) {
		const broadcast = await BroadcastDB.findOne({
			_id: broadcast_id,
			linked_to: this.account._id,
			device_id: this.deviceId,
		});
		if (!broadcast) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}
		return broadcast.name;
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

		const reportSent = await ConversationMessageDB.find({
			'scheduled_by.id': broadcast_id,
		});

		const sentMessages = reportSent.map((message) => ({
			to: message.recipient as string,
			status: message.status as string,
			sendAt: DateUtils.format(message.createdAt, 'DD-MM-YYYY HH:mm') as string,
			text: message.body?.body_type === 'TEXT' ? message.body.text : '',
			template_name: broadcast.template_name as string,
			sent_at: DateUtils.format(message.sent_at, 'DD-MM-YYYY HH:mm') as string,
			read_at: message.read_at ? DateUtils.format(message.read_at, 'DD-MM-YYYY HH:mm') : '',
			delivered_at: message.delivered_at
				? DateUtils.format(message.delivered_at, 'DD-MM-YYYY HH:mm')
				: '',
			failed_at: message.failed_at ? DateUtils.format(message.failed_at, 'DD-MM-YYYY HH:mm') : '',
			failed_reason: message.failed_reason as string,
			description: broadcast.description as string,
		}));

		const reportPending = await ScheduledMessageDB.find({
			scheduler_id: broadcast_id,
		});

		const pendingMessages = reportPending.map((message) => ({
			to: message.to as string,
			status: message.status as string,
			sendAt: DateUtils.format(message.sendAt, 'DD-MM-YYYY HH:mm') as string,
			text: '', //message.body?.body_type === 'TEXT' ? message.body.text : '',
			template_name: broadcast.template_name as string,
			sent_at: '',
			read_at: '',
			delivered_at: '',
			failed_at: message.failed_at ? DateUtils.format(message.failed_at, 'DD-MM-YYYY HH:mm') : '',
			failed_reason: message.failed_reason as string,
			description: broadcast.description as string,
		}));

		return [...sentMessages, ...pendingMessages].sort((a, b) =>
			DateUtils.getMoment(a.sendAt, 'DD-MM-YYYY HH:mm').isAfter(
				DateUtils.getMoment(b.sendAt, 'DD-MM-YYYY HH:mm')
			)
				? 1
				: -1
		);
	}

	public async startBroadcast(
		broadcast: Broadcast,
		options: InstantBroadcastOptions | ScheduledBroadcastOptions
	) {
		const schedulerService = new MessageScheduler(this.userId, this.device._id);
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

		const template = await TemplateFactory.findByName(this.device, broadcast.template_name);

		const messages = broadcast.messages.map((message) => {
			const sendAt = timeGenerator.next(
				options.broadcast_type === 'scheduled' ? undefined : 5
			).value;

			return schedulerService.createScheduleMessageObject(message, {
				scheduler_id: broadcastDoc._id,
				scheduler_type: BroadcastDB_name,
				sendAt,
				formattedMessage: extractFormattedMessage(message.toObject().template, {
					template: template?.buildToSave(),
					type: 'template',
				}),
			});
		});

		await schedulerService.scheduleMessages(messages);

		await Promise.all(messages);
	}

	public async pauseBroadcast(broadcast_id: Types.ObjectId) {
		const campaign = await BroadcastDB.findById(broadcast_id);
		if (!campaign) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}
		await ScheduledMessageDB.updateMany(
			{ scheduler_id: campaign._id, status: MESSAGE_STATUS.PENDING },
			{
				$set: {
					status: MESSAGE_STATUS.PAUSED,
				},
			}
		);
		campaign.status = BROADCAST_STATUS.PAUSED;
		await campaign.save();
		return campaign;
	}

	async resumeBroadcast(campaign_id: Types.ObjectId) {
		const campaign = await BroadcastDB.findById(campaign_id);
		if (!campaign) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		const timeGenerator = new TimeGenerator({
			startDate:
				campaign.broadcast_type === 'scheduled'
					? campaign.startDate
					: DateUtils.getDate('YYYY-MM-DD'),
			startTime: campaign.broadcast_type === 'scheduled' ? campaign.startTime : '00:01',
			endTime: campaign.broadcast_type === 'scheduled' ? campaign.endTime : '23:59',
			daily_count:
				campaign.broadcast_type === 'scheduled' ? campaign.daily_messages_count : 9999999,
		});

		const messages = await ScheduledMessageDB.find({
			scheduler_id: campaign_id,
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
		return campaign;
	}

	async resendBroadcast(campaign_id: Types.ObjectId) {
		const campaign = await BroadcastDB.findById(campaign_id);
		if (!campaign) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		const timeGenerator = new TimeGenerator({
			startDate:
				campaign.broadcast_type === 'scheduled'
					? campaign.startDate
					: DateUtils.getDate('YYYY-MM-DD'),
			startTime: campaign.broadcast_type === 'scheduled' ? campaign.startTime : '00:01',
			endTime: campaign.broadcast_type === 'scheduled' ? campaign.endTime : '23:59',
			daily_count: campaign.broadcast_type === 'scheduled' ? campaign.daily_messages_count : 999999,
		});

		const messages = await ScheduledMessageDB.find({
			scheduler_id: campaign_id,
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
		return campaign;
	}

	async deleteBroadcast(campaign_id: Types.ObjectId) {
		const campaign = await BroadcastDB.findById(campaign_id);
		if (!campaign) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		await ScheduledMessageDB.deleteMany({
			scheduler_id: campaign_id,
		});
		await campaign.delete();
		return campaign;
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

	public static async sendRecursiveBroadcastMessages() {
		const recurringBroadcasts = await RecurringBroadcastDB.find({
			status: BROADCAST_STATUS.ACTIVE,
		}).populate<{
			device_id: IWhatsappLink;
			linked_to: IAccount;
		}>('device_id linked_to');

		const today = DateUtils.getDate('MM-DD');

		recurringBroadcasts.forEach(async (broadcast) => {
			const phoneBook = new PhoneBookService(broadcast.linked_to);
			const schedulerService = new MessageScheduler(
				broadcast.linked_to._id,
				broadcast.device_id._id
			);
			const template = await TemplateFactory.findByName(
				broadcast.device_id,
				broadcast.template_name
			);

			if (!template) {
				return;
			}

			const header = template.getHeader();
			const tButtons = template.getURLButtonsWithVariable();
			const tCarousel = template.getCarouselCards();

			const recipients = (
				await phoneBook.fetchRecords({
					page: 1,
					limit: 99999999,
					labels: broadcast.labels,
				})
			).filter((record) => {
				if (!record.phone_number) {
					return false;
				}
				if (broadcast.wish_from === 'birthday') {
					if (
						DateUtils.getMoment(record.birthday).add(broadcast.delay, 'days').format('MM-DD') ===
						today
					) {
						return true;
					}
				} else if (broadcast.wish_from === 'anniversary') {
					if (
						DateUtils.getMoment(record.anniversary).add(broadcast.delay, 'days').format('MM-DD') ===
						today
					) {
						return true;
					}
				}
				return false;
			});

			const timeGenerator = new TimeGenerator({
				startDate: today,
				startTime: broadcast.startTime,
				endTime: broadcast.endTime,
				daily_count: 99999999,
			});

			const formattedMessages = recipients.map((fields) => {
				const msg = new TemplateMessage(fields.phone_number, template);

				if (header && broadcast.template_header) {
					if (
						header.format !== 'TEXT' &&
						('link' in broadcast.template_header || 'media_id' in broadcast.template_header)
					) {
						msg.setMediaHeader(broadcast.template_header as any);
					}
				}

				const bodyVariables = parseToBodyVariables({
					variables: broadcast.template_body,
					fields,
				});
				msg.setBody(bodyVariables);

				if (tButtons.length > 0) {
					msg.setButtons(broadcast.template_buttons);
				}

				if (tCarousel.length > 0 && broadcast.template_carousel) {
					const cards = broadcast.template_carousel.cards.map((card, index) => {
						const bodyVariables = parseToBodyVariables({
							variables: card.body,
							fields: fields || ({} as IPhonebookRecord),
						});
						return {
							header: card.header,
							body: bodyVariables,
							buttons: card.buttons,
						};
					});
					msg.setCarousel(cards);
				}

				return msg;
			});

			const messagesObjects = formattedMessages.map((msg) => {
				const sendAt = timeGenerator.next(5).value;

				return schedulerService.createScheduleMessageObject(msg, {
					scheduler_id: broadcast._id,
					scheduler_type: RecurringBroadcastDB_name,
					sendAt,
					formattedMessage: extractFormattedMessage(msg.toObject().template, {
						template: template.buildToSave(),
						type: 'template',
					}),
				});
			});

			schedulerService.scheduleMessages(messagesObjects);
		});
	}
}
