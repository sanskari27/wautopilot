import { Types } from 'mongoose';
import Logger from 'n23-logger';
import { ConversationMessageDB } from '../../mongo';
import ChatBotDB, { ChatBotDB_name } from '../../mongo/repo/Chatbot';
import ChatBotFlowDB, { ChatBotFlowDB_name } from '../../mongo/repo/ChatbotFlow';
import FlowMessageDB from '../../mongo/repo/FlowMessages';
import IAccount from '../../mongo/types/account';
import IChatBot from '../../mongo/types/chatbot';
import IChatBotFlow from '../../mongo/types/chatbotFlow';
import IContact from '../../mongo/types/contact';
import IMedia from '../../mongo/types/media';
import IWhatsappLink from '../../mongo/types/whatsappLink';
import { BOT_TRIGGER_OPTIONS, BOT_TRIGGER_TO } from '../config/const';
import { CustomError } from '../errors';
import COMMON_ERRORS from '../errors/common-errors';
import DateUtils from '../utils/DateUtils';
import { Delay, filterUndefinedKeys } from '../utils/ExpressUtils';
import {
	generateBodyText,
	generateButtons,
	generateHeader,
	generateListBody,
	generateSections,
} from '../utils/MessageHelper';
import TimeGenerator from '../utils/TimeGenerator';
import MediaService from './media';
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
		type?: 'IMAGE' | 'TEXT' | 'VIDEO' | 'DOCUMENT';
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

type CreateFlowData = {
	name: string;
	options: BOT_TRIGGER_OPTIONS;
	respond_to: BOT_TRIGGER_TO;
	trigger: string;
	nodes: {
		type:
			| 'startNode'
			| 'textNode'
			| 'imageNode'
			| 'audioNode'
			| 'videoNode'
			| 'documentNode'
			| 'buttonNode'
			| 'listNode';
		id: string;
		position: {
			x: number;
			y: number;
		};
		height: number;
		width: number;
		data?: any;
	}[];
	edges: {
		id: string;
		source: string;
		target: string;
		animated: boolean;
		style?: {
			stroke: string;
		};
		sourceHandle?: string;
		targetHandle?: string;
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
				template_header: el.template_header,
				template_body: el.template_body,
			})),
			group_respond: bot.group_respond,
			isActive: bot.active,
		};
	});
}

function processFlowDocs(docs: IChatBotFlow[]) {
	return docs.map((bot) => {
		return {
			bot_id: bot._id as Types.ObjectId,
			name: bot.name,
			respond_to: bot.respond_to,
			trigger: bot.trigger,
			options: bot.options,
			nodes: bot.nodes.map((node) => ({
				type: node.node_type,
				id: node.id,
				position: node.position,
				height: node.height,
				width: node.width,
				data: node.data,
			})),
			edges: bot.edges,
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
		});
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
		}>('images videos audios documents contacts');
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

			if (bot.respond_type === 'normal') {
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
							id: mediaObject.media_id,
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
							id: mediaObject.media_id,
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
							id: mediaObject.media_id,
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
							id: mediaObject.media_id,
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
								emails: card.emails.map((email) => ({
									type: 'HOME',
									email: email.email,
								})),
								name: card.name,
								org: card.org,
								phones: card.phones.map((phone) => ({
									type: 'HOME',
									phone: phone.phone,
									wa_id: phone.wa_id,
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
			} else if (bot.respond_type === 'template') {
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
						scheduler_type: 'Lead Nurturing',
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
		await ChatBotFlowDB.updateMany(
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

	public async allFlows() {
		const bots = await ChatBotFlowDB.find({
			linked_to: this.userId,
			device_id: this.deviceId,
		});
		return processFlowDocs(bots);
	}

	public async chatBotFlowDetails(id: Types.ObjectId) {
		const bots = await ChatBotFlowDB.find({
			linked_to: this.userId,
			device_id: this.deviceId,
			_id: id,
		});
		if (bots.length === 0) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}
		return processFlowDocs(bots)[0];
	}

	public async createFlow(data: CreateFlowData) {
		const bot = await ChatBotFlowDB.create({
			...data,
			linked_to: this.userId,
			device_id: this.deviceId,
			nodes: data.nodes.map((node) => ({
				node_type: node.type,
				id: node.id,
				position: node.position,
				height: node.height,
				width: node.width,
				data: node.data,
			})),
		});

		return processFlowDocs([bot])[0];
	}

	public async modifyFlow(id: Types.ObjectId, data: Partial<CreateFlowData>) {
		await ChatBotFlowDB.updateOne(
			{ _id: id },
			{
				$set: filterUndefinedKeys({
					...data,
					nodes: data.nodes?.map((node) => ({
						node_type: node.type,
						id: node.id,
						position: node.position,
						height: node.height,
						width: node.width,
						data: node.data,
					})),
				}),
			}
		);
		const bot = await ChatBotFlowDB.findOne({
			_id: id,
			linked_to: this.userId,
			device_id: this.deviceId,
		});
		if (!bot) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		return processFlowDocs([bot])[0];
	}

	public async toggleActiveFlow(id: Types.ObjectId) {
		const bot = await ChatBotFlowDB.findOne({
			_id: id,
			linked_to: this.userId,
			device_id: this.deviceId,
		});
		if (!bot) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}
		bot.active = !bot.active;
		bot.save();
		return processFlowDocs([bot])[0];
	}

	public async deleteFlow(bot_id: Types.ObjectId) {
		await ChatBotFlowDB.deleteOne({ _id: bot_id });
	}

	private async flowsEngaged({
		message_body,
		recipient,
	}: {
		message_body: string;
		recipient: string;
	}) {
		const phonebook = new PhoneBookService(this.account);
		const contact = await phonebook.findRecordByPhone(recipient);
		const bots = await this.allFlows();
		const activeBots = bots.filter((bot) => bot.isActive);

		return activeBots.filter((bot) => {
			const is_recipient =
				bot.respond_to === BOT_TRIGGER_TO.ALL ||
				(bot.respond_to === BOT_TRIGGER_TO.SAVED_CONTACTS && !!contact) ||
				(bot.respond_to === BOT_TRIGGER_TO.NON_SAVED_CONTACTS && !contact);

			if (!is_recipient) {
				return false;
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

	public async checkForFlowKeyword(recipient: string, text: string) {
		const botsEngaged = await this.flowsEngaged({ message_body: text, recipient });
		botsEngaged.forEach(async (bot) => {
			const nodes = bot.nodes;
			const edges = bot.edges;
			const startNode = nodes.find((node) => node.type === 'startNode');
			if (!startNode) {
				return;
			}
			const connectedEdge = edges.find((edge) => edge.source === startNode.id);
			if (!connectedEdge) {
				return;
			}
			const nextNode = nodes.find((node) => node.id === connectedEdge.target);
			if (!nextNode) {
				return;
			}
			this.sendFlowMessage(recipient, bot.bot_id, nextNode.id);
		});
	}

	public async continueFlow(recipient: string, meta_message_id: string, button_id: string) {
		const flowMessage = await FlowMessageDB.findOne({ meta_message_id });
		if (!flowMessage) {
			return;
		}

		const bot = await ChatBotFlowDB.findOne({
			_id: flowMessage.bot_id,
			linked_to: this.userId,
			device_id: this.deviceId,
		});
		if (!bot || !bot.active) {
			return;
		}

		const node_id = flowMessage.node_id;

		const possibleEdge = bot.edges.find(
			(edge) => edge.source === node_id && edge.sourceHandle === button_id
		);
		if (!possibleEdge) {
			return;
		}

		const targetNode = bot.nodes.find((node) => node.id === possibleEdge.target);
		if (!targetNode) {
			return;
		}

		this.sendFlowMessage(recipient, bot._id, targetNode.id);
	}

	public async sendFlowMessage(recipient: string, bot_id: Types.ObjectId, node_id: string) {
		const schedulerService = new SchedulerService(this.account, this.device);
		const mediaService = new MediaService(this.account, this.device);
		const bot = await ChatBotFlowDB.findOne({
			_id: bot_id,
			linked_to: this.userId,
			device_id: this.deviceId,
		});
		if (!bot) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}
		const node = bot.nodes.find((node) => node.id === node_id);
		if (!node) {
			return;
		}
		let message_id;

		if (
			node.node_type === 'imageNode' ||
			node.node_type === 'videoNode' ||
			node.node_type === 'documentNode' ||
			node.node_type === 'audioNode'
		) {
			let type = node.node_type.replace('Node', '').toLowerCase() as
				| 'image'
				| 'video'
				| 'audio'
				| 'document';
			if (type === 'audio') {
				type = 'document';
			}
			const media = await mediaService.getMedia(node.data.id);
			const msgObj = {
				messaging_product: 'whatsapp',
				to: recipient,
				type: 'interactive',
				interactive: {
					type: 'button',
					...generateHeader(type, media.media_id),
					...generateBodyText(node.data.caption),
					action: {
						buttons: generateButtons(node.data.buttons),
					},
				},
			};
			message_id = await schedulerService.schedule(recipient, msgObj, {
				scheduler_id: bot_id,
				scheduler_type: ChatBotFlowDB_name,
				sendAt: DateUtils.getMomentNow().toDate(),
				message_type: 'interactive',
			});
		} else if (node.node_type === 'buttonNode') {
			const msgObj = {
				messaging_product: 'whatsapp',
				to: recipient,
				type: 'interactive',
				interactive: {
					type: 'button',
					...generateBodyText(node.data.text),
					action: {
						buttons: generateButtons(node.data.buttons),
					},
				},
			};
			message_id = await schedulerService.schedule(recipient, msgObj, {
				scheduler_id: bot_id,
				scheduler_type: ChatBotFlowDB_name,
				sendAt: DateUtils.getMomentNow().toDate(),
				message_type: 'interactive',
			});
		} else if (node.node_type === 'textNode') {
			const msgObj = {
				messaging_product: 'whatsapp',
				to: recipient,
				type: 'text',
				text: {
					body: node.data.label,
				},
			};
			message_id = await schedulerService.schedule(recipient, msgObj, {
				scheduler_id: bot_id,
				scheduler_type: ChatBotFlowDB_name,
				sendAt: DateUtils.getMomentNow().toDate(),
				message_type: 'normal',
			});
		} else if (node.node_type === 'listNode') {
			const msgObj = {
				messaging_product: 'whatsapp',
				to: recipient,
				type: 'interactive',
				interactive: {
					type: 'list',
					...generateListBody(node.data),
					action: {
						button: 'Select an option',
						sections: generateSections(node.data.sections),
					},
				},
			};
			message_id = await schedulerService.schedule(recipient, msgObj, {
				scheduler_id: bot_id,
				scheduler_type: ChatBotFlowDB_name,
				sendAt: DateUtils.getMomentNow().toDate(),
				message_type: 'interactive',
			});
		} else {
			return;
		}

		await FlowMessageDB.create({
			linked_to: this.userId,
			device_id: this.deviceId,
			bot_id,
			message_id,
			recipient,
			node_id,
		});
		// recipient, bot_id, node_id, message_id
	}

	public static async updateMessageId(
		chatbot_id: Types.ObjectId,
		{
			prev_id,
			new_id,
			meta_message_id,
		}: {
			prev_id: Types.ObjectId;
			new_id: Types.ObjectId;
			meta_message_id?: string;
		}
	) {
		await FlowMessageDB.updateOne(
			{
				bot_id: chatbot_id,
				message_id: prev_id,
			},
			{
				message_id: new_id,
				meta_message_id,
			}
		);
	}
}
