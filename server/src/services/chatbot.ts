import { Types } from 'mongoose';
import Logger from 'n23-logger';
import { ConversationMessageDB } from '../../mongo';
import ChatBotDB, { ChatBotDB_name } from '../../mongo/repo/Chatbot';
import IAccount from '../../mongo/types/account';
import IChatBot from '../../mongo/types/chatbot';
import IContact from '../../mongo/types/contact';
import IMedia from '../../mongo/types/media';
import IWhatsappLink from '../../mongo/types/whatsapplink';
import { BOT_TRIGGER_OPTIONS, BOT_TRIGGER_TO } from '../config/const';
import { CustomError } from '../errors';
import COMMON_ERRORS from '../errors/common-errors';
import DateUtils from '../utils/DateUtils';
import { Delay, filterUndefinedKeys } from '../utils/ExpressUtils';
import TimeGenerator from '../utils/TimeGenerator';
import PhoneBookService from './phonebook';
import SchedulerService from './scheduler';
import WhatsappLinkService from './whatsappLink';

type CreateBotData = {
	respond_to: BOT_TRIGGER_TO;
	trigger: string;
	trigger_gap_seconds: number;
	response_delay_seconds: number;
	options: BOT_TRIGGER_OPTIONS;
	startAt: string;
	endAt: string;
	respond_type: 'template' | 'normal';
	message: string;
	images: Types.ObjectId[];
	videos: Types.ObjectId[];
	audios: Types.ObjectId[];
	documents: Types.ObjectId[];
	contacts: Types.ObjectId[];
	template_id: string;
	template_name: string;
	template_header?: {
		type: 'IMAGE' | 'TEXT' | 'VIDEO' | 'DOCUMENT';
		media_id?: string;
		link?: string;
	};
	template_body: {
		custom_text: string;
		phonebook_data: string;
		variable_from: 'custom_text' | 'phonebook_data';
		fallback_value: string;
	}[];
	nurturing: {
		template_id: string;
		template_name: string;
		after: number;
		start_from: string;
		end_at: string;
		template_header?: {
			type: 'IMAGE' | 'TEXT' | 'VIDEO' | 'DOCUMENT';
			media_id?: string;
			link?: string;
		};
		template_body: {
			custom_text: string;
			phonebook_data: string;
			variable_from: 'custom_text' | 'phonebook_data';
			fallback_value: string;
		}[];
	}[];
};

function processDocs(docs: IChatBot[]) {
	return docs.map((bot) => {
		return {
			bot_id: bot._id as Types.ObjectId,
			respond_to: bot.respond_to,
			trigger: bot.trigger,
			trigger_gap_seconds: bot.trigger_gap_seconds,
			response_delay_seconds: bot.response_delay_seconds,
			options: bot.options,
			message: bot.message,
			startAt: bot.startAt,
			endAt: bot.endAt,
			respond_type: bot.respond_type,
			images: bot.images ?? [],
			videos: bot.videos ?? [],
			audios: bot.audios ?? [],
			documents: bot.documents ?? [],
			contacts: bot.contacts ?? [],
			template_id: bot.template_id,
			template_name: bot.template_name,
			template_header: bot.template_header,
			template_body: bot.template_body,

			nurturing: (bot.nurturing ?? []).map((el) => ({
				template_id: el.template_id,
				template_name: el.template_name,
				after: el.after,
				start_from: el.start_from,
				end_at: el.end_at,
				template_header: bot.template_header,
				template_body: bot.template_body,
			})),
			group_respond: bot.group_respond,
			isActive: bot.active,
		};
	});
}

const bodyParametersList = [
	'first_name',
	'last_name',
	'middle_name',
	'phone_number',
	'email',
	'birthday',
	'anniversary',
];

export default class ChatBotService extends WhatsappLinkService {
	public constructor(user: IAccount, device: IWhatsappLink) {
		super(user, device);
	}

	public async allBots() {
		const bots = await ChatBotDB.find({
			linked_to: this.userId,
			device_id: this.deviceId,
		}).populate('images videos audios documents contacts ');
		return processDocs(bots);
	}

	public async allBotsDetailed() {
		const bots = await ChatBotDB.find({
			linked_to: this.userId,
			device_id: this.deviceId,
		}).populate<{
			images: IMedia[];
			videos: IMedia[];
			audios: IMedia[];
			documents: IMedia[];
			contacts: IContact[];
		}>('images videos audios documents contacts ');
		return bots;
	}

	public async boyByID(id: Types.ObjectId) {
		const bot = await ChatBotDB.findById(id);

		if (!bot) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		return processDocs([bot])[0];
	}

	private async activeBots() {
		const bots = await this.allBotsDetailed();
		return bots.filter((bot) => bot.active);
	}

	private async lastMessages(ids: Types.ObjectId[], recipient: string) {
		const responses = await ConversationMessageDB.find({
			linked_to: this.userId,
			device_id: this.deviceId,
			recipient,
			'scheduled_by.id': { $in: ids },
		});

		return responses.reduce(
			(acc, item) => {
				let diff = DateUtils.getMoment(item.sent_at).diff(DateUtils.getMomentNow(), 'seconds');
				diff = Math.abs(diff);
				const bot_id = item.scheduled_by?.id?.toString();
				acc[bot_id] = acc[bot_id] ? Math.min(diff, acc[bot_id]) : diff;
				return acc;
			},
			{} as {
				[key: string]: number;
			}
		);
	}

	private async botsEngaged({
		message_body,
		recipient,
	}: {
		message_body: string;
		recipient: string;
	}) {
		const phonebook = new PhoneBookService(this.account);
		const contact = await phonebook.findRecordByPhone(recipient);
		const bots = await this.activeBots();
		const last_messages = await this.lastMessages(
			bots.map((bot) => bot._id),
			recipient
		);

		return bots.filter((bot) => {
			const is_recipient =
				bot.respond_to === BOT_TRIGGER_TO.ALL ||
				(bot.respond_to === BOT_TRIGGER_TO.SAVED_CONTACTS && !!contact) ||
				(bot.respond_to === BOT_TRIGGER_TO.NON_SAVED_CONTACTS && !contact);

			if (!is_recipient) {
				return false;
			}

			if (!DateUtils.isTimeBetween(bot.startAt, bot.endAt, DateUtils.getMomentNow())) {
				return false;
			}

			if (bot.trigger_gap_seconds > 0) {
				const last_message_time = last_messages[bot._id.toString()];
				if (!isNaN(last_message_time) && last_message_time <= bot.trigger_gap_seconds) {
					return false;
				}
			}
			if (bot.trigger === '') {
				return true;
			}
			if (bot.options === BOT_TRIGGER_OPTIONS.EXACT_IGNORE_CASE) {
				return message_body.toLowerCase() === bot.trigger.toLowerCase();
			}
			if (bot.options === BOT_TRIGGER_OPTIONS.EXACT_MATCH_CASE) {
				return message_body === bot.trigger;
			}

			if (bot.options === BOT_TRIGGER_OPTIONS.INCLUDES_IGNORE_CASE) {
				const lowerCaseSentence = bot.trigger.toLowerCase();
				const lowerCaseParagraph = message_body.toLowerCase();

				// Split the paragraph into words
				const words_paragraph = lowerCaseParagraph.split(/\s+/);
				const sentence_paragraph = lowerCaseSentence.split(/\s+/);

				return words_paragraph.some(
					(_, index, arr) =>
						arr.slice(index, index + sentence_paragraph.length).join() === sentence_paragraph.join()
				);
			}
			if (bot.options === BOT_TRIGGER_OPTIONS.INCLUDES_MATCH_CASE) {
				const lowerCaseSentence = bot.trigger;
				const lowerCaseParagraph = message_body;

				// Split the paragraph into words
				const words_paragraph = lowerCaseParagraph.split(/\s+/);
				const sentence_paragraph = lowerCaseSentence.split(/\s+/);

				return words_paragraph.some(
					(_, index, arr) =>
						arr.slice(index, index + sentence_paragraph.length).join() === sentence_paragraph.join()
				);
			}

			return false;
		});
	}

	public async handleMessage(
		recipient: string,
		text: string,
		opts: {
			fromGroup?: boolean;
		} = {}
	) {
		const botsEngaged = await this.botsEngaged({ message_body: text, recipient });
		const schedulerService = new SchedulerService(this.account, this.device);
		const phonebook = new PhoneBookService(this.account);
		const contact = await phonebook.findRecordByPhone(recipient);
		Logger.debug({
			recipient,
			text,
			botCount: botsEngaged.length,
		});

		botsEngaged.forEach(async (bot) => {
			if (opts.fromGroup && !bot.group_respond) {
				return;
			}

			await Delay(bot.response_delay_seconds);
			Logger.info(
				'BOT TRIGGERED',
				JSON.stringify({
					recipient,
					message_text: text,
					bot_id: bot._id,
				})
			);

			let msg = bot.message;
			if (msg) {
				if (msg.includes('{{first_name}}')) {
					msg = msg.replace('{{first_name}}', contact?.first_name ?? '');
				}
				if (msg.includes('{{middle_name}}')) {
					msg = msg.replace('{{middle_name}}', contact?.middle_name ?? '');
				}
				if (msg.includes('{{last_name}}')) {
					msg = msg.replace('{{last_name}}', contact?.last_name ?? '');
				}
				if (msg.includes('{{phone_number}}')) {
					msg = msg.replace('{{phone_number}}', contact?.phone_number ?? '');
				}
				if (msg.includes('{{email}}')) {
					msg = msg.replace('{{email}}', contact?.email ?? '');
				}
				if (msg.includes('{{birthday}}')) {
					msg = msg.replace('{{birthday}}', contact?.birthday ?? '');
				}
				if (msg.includes('{{anniversary}}')) {
					msg = msg.replace('{{anniversary}}', contact?.anniversary ?? '');
				}

				const msgObj = {
					messaging_product: 'whatsapp',
					to: recipient,
					type: 'text',
					text: {
						body: msg,
					},
				};

				await schedulerService.schedule(recipient, msgObj, {
					scheduler_id: bot._id,
					scheduler_type: ChatBotDB_name,
					sendAt: DateUtils.getMomentNow().toDate(),
					message_type: 'normal',
				});
			}

			for (const mediaObject of bot.images) {
				const msgObj = {
					messaging_product: 'whatsapp',
					to: recipient,
					type: 'image',
					image: {
						id: mediaObject.id,
					},
				};

				await schedulerService.schedule(recipient, msgObj, {
					scheduler_id: bot._id,
					scheduler_type: ChatBotDB_name,
					sendAt: DateUtils.getMomentNow().toDate(),
					message_type: 'normal',
				});
			}

			for (const mediaObject of bot.videos) {
				const msgObj = {
					messaging_product: 'whatsapp',
					to: recipient,
					type: 'video',
					video: {
						id: mediaObject.id,
					},
				};

				await schedulerService.schedule(recipient, msgObj, {
					scheduler_id: bot._id,
					scheduler_type: ChatBotDB_name,
					sendAt: DateUtils.getMomentNow().toDate(),
					message_type: 'normal',
				});
			}

			for (const mediaObject of bot.audios) {
				const msgObj = {
					messaging_product: 'whatsapp',
					to: recipient,
					type: 'audio',
					audio: {
						id: mediaObject.id,
					},
				};

				await schedulerService.schedule(recipient, msgObj, {
					scheduler_id: bot._id,
					scheduler_type: ChatBotDB_name,
					sendAt: DateUtils.getMomentNow().toDate(),
					message_type: 'normal',
				});
			}

			for (const mediaObject of bot.documents) {
				const msgObj = {
					messaging_product: 'whatsapp',
					to: recipient,
					type: 'document',
					document: {
						id: mediaObject.id,
					},
				};

				await schedulerService.schedule(recipient, msgObj, {
					scheduler_id: bot._id,
					scheduler_type: ChatBotDB_name,
					sendAt: DateUtils.getMomentNow().toDate(),
					message_type: 'normal',
				});
			}

			(bot.contacts ?? []).forEach(async (card) => {
				const msgObj = {
					messaging_product: 'whatsapp',
					to: recipient,
					type: 'contacts',
					contacts: [
						{
							addresses: card.addresses,
							birthday: card.birthday,
							emails: card.emails,
							name: card.name,
							org: card.org,
							phones: card.phones.map((phone) => ({
								type: 'HOME',
								phone: phone.phone,
								waid: phone.wa_id,
							})),
							urls: card.urls.map((url) => ({
								type: 'HOME',
								url: url.url,
							})),
						},
					],
				};

				await schedulerService.schedule(recipient, msgObj, {
					scheduler_id: bot._id,
					scheduler_type: ChatBotDB_name,
					sendAt: DateUtils.getMomentNow().toDate(),
					message_type: 'normal',
				});
			});

			if (bot.template_id) {
				let headers = [] as Record<string, unknown>[];

				if (bot.template_header && bot.template_header.type) {
					const object = {
						...(bot.template_header.media_id
							? { id: bot.template_header.media_id }
							: bot.template_header.link
							? { link: bot.template_header.link }
							: {}),
					};

					headers = [
						{
							type: 'HEADER',
							parameters:
								bot.template_header.type !== 'TEXT'
									? [
											{
												type: bot.template_header.type,
												[bot.template_header.type.toLowerCase()]: object,
											},
									  ]
									: [],
						},
					];
				}

				const messageObject = {
					template_name: bot.template_name,
					to: recipient,
					components: [
						{
							type: 'BODY',
							parameters: bot.template_body.map((b) => {
								if (b.variable_from === 'custom_text') {
									return {
										type: 'text',
										text: b.custom_text,
									};
								} else {
									if (!contact) {
										return {
											type: 'text',
											text: b.fallback_value,
										};
									}

									const fieldVal = (
										bodyParametersList.includes(b.phonebook_data)
											? contact[b.phonebook_data as keyof typeof contact]
											: contact.others[b.phonebook_data]
									) as string;

									if (typeof fieldVal === 'string') {
										return {
											type: 'text',
											text: fieldVal || b.fallback_value,
										};
									}
									// const field = fields[]
									return {
										type: 'text',
										text: b.fallback_value,
									};
								}
							}),
						},
						...headers,
					],
				};

				await schedulerService.schedule(recipient, messageObject, {
					scheduler_id: bot._id,
					scheduler_type: ChatBotDB_name,
					sendAt: DateUtils.getMomentNow().toDate(),
					message_type: 'template',
				});
			}

			if (bot.nurturing.length > 0) {
				const dateGenerator = new TimeGenerator();


				bot.nurturing.map(async (el) => {
					const fields = await phonebook.findRecordByPhone(recipient);

					let headers = [] as Record<string, unknown>[];

					if (el.template_header && el.template_header.type) {

						const object = {
							...(el.template_header.media_id
								? { id: el.template_header.media_id }
								: el.template_header.link
								? { link: el.template_header.link }
								: {}),
						};

						headers = [
							{
								type: 'HEADER',
								parameters:
									el.template_header.type !== 'TEXT'
										? [
												{
													type: el.template_header.type,
													[el.template_header.type.toLowerCase()]: object,
												},
										  ]
										: [],
							},
						];
					}

					const messageObject = {
						template_name: el.template_name,
						to: recipient,
						components: [
							{
								type: 'BODY',
								parameters: el.template_body.map((b) => {
									if (b.variable_from === 'custom_text') {
										return {
											type: 'text',
											text: b.custom_text,
										};
									} else {
										if (!fields) {
											return {
												type: 'text',
												text: b.fallback_value,
											};
										}

										const fieldVal = (
											bodyParametersList.includes(b.phonebook_data)
												? fields[b.phonebook_data as keyof typeof fields]
												: fields.others[b.phonebook_data]
										) as string;

										if (typeof fieldVal === 'string') {
											return {
												type: 'text',
												text: fieldVal || b.fallback_value,
											};
										}
										// const field = fields[]
										return {
											type: 'text',
											text: b.fallback_value,
										};
									}
								}),
							},
							...headers,
						],
					};

					await schedulerService.schedule(recipient, messageObject, {
						scheduler_id: bot._id,
						scheduler_type: ChatBotDB_name,
						sendAt: dateGenerator.next(el.after).value,
						message_type: 'template',
					});
				});
			}
		});
	}

	public async createBot(data: CreateBotData) {
		const bot = await ChatBotDB.create({
			...data,
			linked_to: this.userId,
			device_id: this.deviceId,
		});

		return processDocs([bot])[0];
	}

	public async modifyBot(id: Types.ObjectId, data: Partial<CreateBotData>) {
		await ChatBotDB.updateOne({ _id: id }, { $set: filterUndefinedKeys(data) });
		const bot = await ChatBotDB.findOne({
			_id: id,
			linked_to: this.userId,
			device_id: this.deviceId,
		});
		if (!bot) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		return processDocs([bot])[0];
	}

	public async toggleActive(id: Types.ObjectId) {
		const bot = await ChatBotDB.findOne({
			_id: id,
			linked_to: this.userId,
			device_id: this.deviceId,
		});
		if (!bot) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}
		bot.active = !bot.active;
		bot.save();
		return processDocs([bot])[0];
	}

	public async pauseAll() {
		await ChatBotDB.updateMany(
			{ linked_to: this.userId, device_id: this.deviceId },
			{ active: false }
		);
	}

	public async deleteBot(bot_id: Types.ObjectId) {
		await ChatBotDB.deleteOne({ _id: bot_id });
	}

	public async botResponses(bot_id: Types.ObjectId) {
		const bot = await ChatBotDB.findById(bot_id);
		const responses = await ConversationMessageDB.find({
			linked_to: this.userId,
			device_id: this.deviceId,
			scheduled_by: {
				id: bot_id,
				name: ChatBotDB_name,
			},
		});
		if (!bot) {
			return [];
		}

		return responses.map((chat) => ({
			trigger: bot.trigger,
			recipient: chat.recipient,
			triggered_at: DateUtils.getMoment(chat.sent_at).format('DD-MM-YYYY HH:mm:ss'),
			message_type: chat.body.body_type,
			text: chat.body.text,
		}));
	}
}
