import { Types } from 'mongoose';
import { ConversationMessageDB } from '../../mongo';
import ChatBotDB, { ChatBotDB_name } from '../../mongo/repo/Chatbot';
import ChatBotFlowDB, { ChatBotFlowDB_name } from '../../mongo/repo/ChatbotFlow';
import FlowMessageDB from '../../mongo/repo/FlowMessages';
import IAccount from '../../mongo/types/account';
import IChatBot from '../../mongo/types/chatbot';
import IChatBotFlow from '../../mongo/types/chatbotFlow';
import IContact from '../../mongo/types/contact';
import IMedia from '../../mongo/types/media';
import IPhoneBook from '../../mongo/types/phonebook';
import IWhatsappLink from '../../mongo/types/whatsappLink';
import { BOT_TRIGGER_OPTIONS } from '../config/const';
import { CustomError } from '../errors';
import COMMON_ERRORS from '../errors/common-errors';
import DateUtils from '../utils/DateUtils';
import { Delay, filterUndefinedKeys } from '../utils/ExpressUtils';
import {
	generateBodyText,
	generateButtons,
	generateContactMessageObject,
	generateHeader,
	generateListBody,
	generateMediaMessageObject,
	generateSections,
	generateTemplateMessageObject,
	generateTextMessageObject,
	parseVariables,
} from '../utils/MessageHelper';
import TimeGenerator from '../utils/TimeGenerator';
import MediaService from './media';
import PhoneBookService from './phonebook';
import SchedulerService from './scheduler';
import WhatsappFlowService from './wa_flow';
import WhatsappLinkService from './whatsappLink';

type CreateBotData = {
	trigger: string[];
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
	forward: { number: string; message: string };
};

type CreateFlowData = {
	name: string;
	options: BOT_TRIGGER_OPTIONS;
	trigger: string[];
	nodes: {
		type:
			| 'startNode'
			| 'textNode'
			| 'imageNode'
			| 'audioNode'
			| 'videoNode'
			| 'documentNode'
			| 'buttonNode'
			| 'listNode'
			| 'flowNode'
			| 'contactNode'
			| 'locationRequestNode'
			| 'endNode';
		id: string;
		position: {
			x: number;
			y: number;
		};
		measured: {
			height: number;
			width: number;
		};
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
	nurturing: {
		after: number;
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
	}[];
	forward: { number: string; message: string };
};

function processDocs(docs: IChatBot[]) {
	return docs.map((bot) => {
		return {
			bot_id: bot._id as Types.ObjectId,
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

			nurturing: bot.nurturing ?? [],
			forward: bot.forward ?? {
				number: '',
				message: '',
			},
			isActive: bot.active,
		};
	});
}

function processFlowDocs(docs: IChatBotFlow[]) {
	return docs.map((bot) => {
		return {
			bot_id: bot._id as Types.ObjectId,
			name: bot.name,
			trigger: bot.trigger,
			options: bot.options,
			nodes: bot.nodes.map((node) => ({
				type: node.node_type,
				id: node.id,
				position: node.position,
				measured: node.measured ?? {
					width: 400,
					height: 400,
				},
				data: node.data,
			})),
			edges: bot.edges,
			nurturing: bot.nurturing || [],
			forward: bot.forward ?? {
				number: '',
				message: '',
			},
			isActive: bot.active,
		};
	});
}

type IChatBotFlowPopulated = Omit<IChatBotFlow, 'nurturing'> & {
	nurturing: {
		after: number;
		respond_type: 'template' | 'normal';
		message: string;
		images: IMedia[];
		videos: IMedia[];
		audios: IMedia[];
		documents: IMedia[];
		contacts: IContact[];
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
	}[];
};

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

	public async boyByID(id: Types.ObjectId) {
		const bot = await ChatBotDB.findById(id);

		if (!bot) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		return processDocs([bot])[0];
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
		if (bot) {
			bot.active = !bot.active;
			bot.save();
			return;
		}

		const flow = await ChatBotFlowDB.findOne({
			_id: id,
			linked_to: this.userId,
			device_id: this.deviceId,
		});
		if (flow) {
			flow.active = !flow.active;
			flow.save();
			return;
		}

		if (!bot && !flow) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}
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
		await ChatBotDB.deleteMany({ _id: bot_id, linked_to: this.userId });
		await ChatBotFlowDB.deleteMany({ _id: bot_id, linked_to: this.userId });
	}

	public async botResponses(bot_id: Types.ObjectId, type: 'chatbot' | 'chatbotflow' = 'chatbot') {
		let bot;
		if (type === 'chatbot') {
			bot = await ChatBotDB.findById(bot_id);
		} else {
			bot = await ChatBotFlowDB.findById(bot_id);
		}
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
				measured: node.measured,
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
						measured: node.measured,
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

	private async lastMessages(
		ids: Types.ObjectId[],
		recipient: string
	): Promise<{ [key: string]: number }> {
		const responses = await ConversationMessageDB.find({
			linked_to: this.userId,
			device_id: this.deviceId,
			recipient,
			'scheduled_by.id': { $in: ids },
		})
			.sort({ sent_at: -1 })
			.distinct('scheduled_by.id');

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

	private async botsEngaged<
		T extends
			| IChatBotFlowPopulated
			| (Omit<
					IChatBot &
						Required<{
							_id: Types.ObjectId;
						}>,
					'images' | 'videos' | 'audios' | 'documents' | 'contacts'
			  > & {
					images: IMedia[];
					videos: IMedia[];
					audios: IMedia[];
					documents: IMedia[];
					contacts: IContact[];
			  })
	>({
		bots,
		message_body,
		recipient,
	}: {
		bots: T[];
		message_body: string;
		recipient: string;
	}): Promise<T[]> {
		if (bots.length === 0) {
			return [];
		}
		let last_messages: { [key: string]: number } = {};
		if (instanceOfChatbot(bots[0])) {
			last_messages = await this.lastMessages(
				bots.map((bot) => bot._id),
				recipient
			);
		}

		return bots.filter((bot) => {
			if (instanceOfChatbot(bot)) {
				if (!DateUtils.isTimeBetween(bot.startAt, bot.endAt, DateUtils.getMomentNow())) {
					return false;
				} else if (bot.trigger_gap_seconds > 0) {
					const last_message_time = last_messages[bot._id.toString()];
					if (!isNaN(last_message_time) && last_message_time <= bot.trigger_gap_seconds) {
						return false;
					}
				}
			}
			if (bot.trigger.length === 0) {
				return true;
			}
			let match = false;
			for (const trigger of bot.trigger) {
				if (match) {
					break;
				}
				if (bot.options === BOT_TRIGGER_OPTIONS.EXACT_IGNORE_CASE) {
					if (message_body.toLowerCase() === trigger.toLowerCase()) {
						match = true;
					}
				} else if (bot.options === BOT_TRIGGER_OPTIONS.EXACT_MATCH_CASE) {
					if (message_body === trigger) {
						match = true;
					}
				} else if (bot.options === BOT_TRIGGER_OPTIONS.INCLUDES_IGNORE_CASE) {
					const lowerCaseSentence = trigger.toLowerCase();
					const lowerCaseParagraph = message_body.toLowerCase();

					// Split the paragraph into words
					const words_paragraph = lowerCaseParagraph.split(/\s+/);
					const sentence_paragraph = lowerCaseSentence.split(/\s+/);

					const _match = words_paragraph.some(
						(_, index, arr) =>
							arr.slice(index, index + sentence_paragraph.length).join() ===
							sentence_paragraph.join()
					);
					if (_match) {
						match = true;
					}
				} else if (bot.options === BOT_TRIGGER_OPTIONS.INCLUDES_MATCH_CASE) {
					const lowerCaseSentence = trigger;
					const lowerCaseParagraph = message_body;

					// Split the paragraph into words
					const words_paragraph = lowerCaseParagraph.split(/\s+/);
					const sentence_paragraph = lowerCaseSentence.split(/\s+/);

					const _match = words_paragraph.some(
						(_, index, arr) =>
							arr.slice(index, index + sentence_paragraph.length).join() ===
							sentence_paragraph.join()
					);
					if (_match) {
						match = true;
					}
				}
			}

			return match;
		});
	}

	public async handleMessage(recipient: string, text: string, meta_message_id?: string) {
		const schedulerService = new SchedulerService(this.account, this.device);
		const phonebook = new PhoneBookService(this.account);
		const contact = await phonebook.findRecordByPhone(recipient);

		const chatBots = await ChatBotDB.find({
			linked_to: this.userId,
			device_id: this.deviceId,
			active: true,
		}).populate<{
			images: IMedia[];
			videos: IMedia[];
			audios: IMedia[];
			documents: IMedia[];
			contacts: IContact[];
		}>('images videos audios documents contacts');

		// pupulate nurturing for chatbotflows

		const flows: IChatBotFlowPopulated[] = await ChatBotFlowDB.find({
			linked_to: this.userId,
			device_id: this.deviceId,
			active: true,
		}).populate([
			{ path: 'nurturing.images' }, // MediaDB_name
			{ path: 'nurturing.videos' }, // MediaDB_name
			{ path: 'nurturing.audios' }, // MediaDB_name
			{ path: 'nurturing.documents' }, // MediaDB_name
			{ path: 'nurturing.contacts' }, // ContactDB_name
		]);

		const chatbotEngaged = await this.botsEngaged({
			bots: chatBots,
			message_body: text,
			recipient,
		});

		const flowsEngaged = await this.botsEngaged({
			recipient,
			bots: flows,
			message_body: text,
		});

		chatbotEngaged.forEach(async (bot) => {
			await Delay(bot.response_delay_seconds);

			const schedulerOptions = {
				scheduler_id: bot._id,
				scheduler_type: ChatBotDB_name,
				sendAt: DateUtils.getMomentNow().toDate(),
				message_type: bot.respond_type as 'template' | 'normal' | 'interactive',
			};

			if (bot.respond_type === 'normal') {
				let msg = bot.message;
				if (msg) {
					msg = parseVariables(msg, contact as unknown as Record<string, string>);

					const msgObj = generateTextMessageObject(recipient, msg);
					await schedulerService.schedule(recipient, msgObj, schedulerOptions);
				}

				for (const mediaObject of bot.images) {
					const msgObj = generateMediaMessageObject(recipient, {
						media_id: mediaObject.media_id,
						type: 'image',
					});
					await schedulerService.schedule(recipient, msgObj, schedulerOptions);
				}

				for (const mediaObject of bot.videos) {
					const msgObj = generateMediaMessageObject(recipient, {
						media_id: mediaObject.media_id,
						type: 'video',
					});
					await schedulerService.schedule(recipient, msgObj, schedulerOptions);
				}

				for (const mediaObject of bot.audios) {
					const msgObj = generateMediaMessageObject(recipient, {
						media_id: mediaObject.media_id,
						type: 'audio',
					});
					await schedulerService.schedule(recipient, msgObj, schedulerOptions);
				}

				for (const mediaObject of bot.documents) {
					const msgObj = generateMediaMessageObject(recipient, {
						media_id: mediaObject.media_id,
						type: 'document',
					});
					await schedulerService.schedule(recipient, msgObj, schedulerOptions);
				}

				(bot.contacts ?? []).forEach(async (card) => {
					const msgObj = generateContactMessageObject(recipient, card);
					await schedulerService.schedule(recipient, msgObj, schedulerOptions);
				});
			} else if (bot.respond_type === 'template' && bot.template_id) {
				const msgObj = generateTemplateMessageObject(recipient, {
					template_name: bot.template_name,
					header: bot.template_header,
					body: bot.template_body,
					contact: contact as unknown as IPhoneBook,
				});
				await schedulerService.schedule(recipient, msgObj, schedulerOptions);
			}

			if (bot.nurturing.length > 0) {
				const dateGenerator = new TimeGenerator();

				bot.nurturing.map(async (el) => {
					const msgObj = generateTemplateMessageObject(recipient, {
						template_name: bot.template_name,
						header: bot.template_header,
						body: bot.template_body,
						contact: contact as unknown as IPhoneBook,
					});

					await schedulerService.schedule(recipient, msgObj, {
						scheduler_id: bot._id,
						scheduler_type: 'Lead Nurturing',
						sendAt: dateGenerator.next(el.after).value,
						message_type: 'template',
					});
				});
			}

			if (bot.forward && bot.forward.number) {
				const custom_message = parseVariables(
					bot.forward.message,
					contact as unknown as Record<string, string>
				).replace(`{{trigger}}`, text);

				const msgObj = generateTextMessageObject(bot.forward.number, custom_message);
				await schedulerService.schedule(bot.forward.number, msgObj, {
					scheduler_id: bot._id,
					scheduler_type: ChatBotFlowDB_name,
					sendAt: DateUtils.getMomentNow().toDate(),
					message_type: 'normal',
				});
			}
		});

		flowsEngaged.forEach(async (bot) => {
			let startNode = bot.nodes.find((node) => node.node_type === 'startNode');
			if (!startNode) {
				return;
			}
			this.processFlowNode(recipient, {
				bot,
				start_node_id: startNode?.id,
				meta_message_id,
			});

			if (bot.forward && bot.forward.number) {
				const custom_message = parseVariables(
					bot.forward.message,
					contact as unknown as Record<string, string>
				).replace(`{{trigger}}`, text);
				const msgObj = generateTextMessageObject(bot.forward.number, custom_message);
				await schedulerService.schedule(bot.forward.number, msgObj, {
					scheduler_id: bot._id,
					scheduler_type: ChatBotFlowDB_name,
					sendAt: DateUtils.getMomentNow().toDate(),
					message_type: 'normal',
				});
			}
		});
	}

	public async continueFlow(
		recipient: string,
		context_message_id: string,
		button_id: string,
		meta_message_id?: string
	) {
		const flowMessage = await FlowMessageDB.findOne({ meta_message_id: context_message_id });
		if (!flowMessage) {
			return;
		}

		const bot: IChatBotFlowPopulated | null = await ChatBotFlowDB.findOne({
			_id: flowMessage.bot_id,
			linked_to: this.userId,
			device_id: this.deviceId,
			active: true,
		}).populate([
			{ path: 'nurturing.images' }, // MediaDB_name
			{ path: 'nurturing.videos' }, // MediaDB_name
			{ path: 'nurturing.audios' }, // MediaDB_name
			{ path: 'nurturing.documents' }, // MediaDB_name
			{ path: 'nurturing.contacts' }, // ContactDB_name
		]);
		if (!bot) {
			return;
		}

		const connectedEdge = bot.edges.find(
			(edge) =>
				edge.sourceHandle === button_id ||
				(edge.sourceHandle === 'source' && edge.source === button_id)
		);

		if (!connectedEdge) {
			return;
		}

		this.processFlowNode(recipient, {
			bot,
			start_node_id: connectedEdge.target,
			isNodeStarted: true,
			meta_message_id,
		});
	}

	private async processFlowNode(
		recipient: string,
		details: {
			bot: IChatBotFlowPopulated;
			start_node_id: string;
			isNodeStarted?: boolean;
			meta_message_id?: string;
		}
	) {
		const phonebook = new PhoneBookService(this.account);
		const schedulerService = new SchedulerService(this.account, this.device);
		const contact = await phonebook.findRecordByPhone(recipient);
		const nodes = details.bot.nodes;
		const edges = details.bot.edges;
		let startNode = details.bot.nodes.find((node) => node.id === details.start_node_id);

		let extra_delay = 0;
		if (details.isNodeStarted && startNode) {
			this.sendFlowMessage(recipient, details.bot._id, startNode.id);
			extra_delay += Math.max(0, startNode.data.delay || 0);
		}

		let isEnd = false;
		do {
			if (!startNode) {
				break;
			}
			const connectedEdge = edges.find(
				(edge) =>
					edge.sourceHandle === startNode?.id ||
					(edge.sourceHandle === 'source' && edge.source === startNode?.id)
			);
			if (!connectedEdge) {
				break;
			}
			const nextNode = nodes.find((node) => node.id === connectedEdge.target);
			if (!nextNode) {
				break;
			}

			this.sendFlowMessage(recipient, details.bot._id, nextNode.id, {
				extra_delay,
				meta_message_id: details.meta_message_id,
			});
			startNode = nextNode;
			if (nextNode.node_type === 'endNode') {
				isEnd = true;
			}
			extra_delay += Math.max(0, nextNode.data.delay || 0);
			await Delay(2);
		} while (true);

		schedulerService.deleteNurturingByFlow(details.bot._id);

		if (isEnd) {
			return;
		}

		if (details.bot.nurturing.length > 0) {
			const dateGenerator = new TimeGenerator({
				startTime: '00:01',
				endTime: '23:59',
			});

			details.bot.nurturing.map(async (el) => {
				const schedulerOptions = {
					scheduler_id: details.bot._id,
					scheduler_type: 'ChatbotFlow Nurturing',
					sendAt: dateGenerator.next(el.after).value,
					message_type: el.respond_type as 'template' | 'normal' | 'interactive',
				};
				if (el.respond_type === 'normal') {
					let msg = el.message;
					if (msg) {
						msg = parseVariables(msg, contact as unknown as Record<string, string>);
						const msgObj = generateTextMessageObject(recipient, msg);
						await schedulerService.schedule(recipient, msgObj, schedulerOptions);
					}
					schedulerOptions.message_type = 'interactive';

					for (const mediaObject of el.images) {
						const msgObj = generateMediaMessageObject(recipient, {
							media_id: mediaObject.media_id,
							type: 'image',
						});
						await schedulerService.schedule(recipient, msgObj, schedulerOptions);
					}

					for (const mediaObject of el.videos) {
						const msgObj = generateMediaMessageObject(recipient, {
							media_id: mediaObject.media_id,
							type: 'video',
						});
						await schedulerService.schedule(recipient, msgObj, schedulerOptions);
					}

					for (const mediaObject of el.audios) {
						const msgObj = generateMediaMessageObject(recipient, {
							media_id: mediaObject.media_id,
							type: 'audio',
						});
						await schedulerService.schedule(recipient, msgObj, schedulerOptions);
					}

					for (const mediaObject of el.documents) {
						const msgObj = generateMediaMessageObject(recipient, {
							media_id: mediaObject.media_id,
							type: 'document',
						});
						await schedulerService.schedule(recipient, msgObj, schedulerOptions);
					}

					(el.contacts ?? []).forEach(async (card) => {
						const msgObj = generateContactMessageObject(recipient, card);
						await schedulerService.schedule(recipient, msgObj, schedulerOptions);
					});
				} else if (el.respond_type === 'template' && el.template_id) {
					const msgObj = generateTemplateMessageObject(recipient, {
						template_name: el.template_name,
						header: el.template_header,
						body: el.template_body,
						contact: contact as unknown as IPhoneBook,
					});
					await schedulerService.schedule(recipient, msgObj, schedulerOptions);
				}
			});
		}
	}

	public async sendFlowMessage(
		recipient: string,
		bot_id: Types.ObjectId,
		node_id: string,
		details?: {
			extra_delay?: number;
			meta_message_id?: string;
		}
	) {
		const schedulerService = new SchedulerService(this.account, this.device);
		const whatsappFlow = new WhatsappFlowService(this.account, this.device);
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
		const delay = (details?.extra_delay ?? 0) + Math.max(0, node.data.delay || 0);
		let message_id;
		const schedulerOptions = {
			scheduler_id: bot_id,
			scheduler_type: ChatBotFlowDB_name,
			sendAt: DateUtils.getMomentNow().add(delay, 'seconds').toDate(),
			message_type: 'normal' as 'interactive' | 'normal' | 'template',
		};
		const context =
			details?.meta_message_id && node.data.reply_to_message
				? {
						context: {
							message_id: details.meta_message_id,
						},
				  }
				: {};
		if (node.node_type === 'textNode') {
			const msgObj = {
				messaging_product: 'whatsapp',
				to: recipient,
				type: 'text',
				text: {
					body: node.data.label,
				},
				...context,
			};
			message_id = await schedulerService.schedule(recipient, msgObj, schedulerOptions);
		} else if (node.node_type === 'contactNode') {
			try {
				const msgObj = {
					messaging_product: 'whatsapp',
					to: recipient,
					type: 'contacts',
					contacts: [node.data.contact],
					...context,
				};
				message_id = await schedulerService.schedule(recipient, msgObj, schedulerOptions);
			} catch (err) {}
		} else if (
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
				...context,
			};
			schedulerOptions.message_type = 'interactive';
			message_id = await schedulerService.schedule(recipient, msgObj, schedulerOptions);
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
				...context,
			};
			schedulerOptions.message_type = 'interactive';
			message_id = await schedulerService.schedule(recipient, msgObj, schedulerOptions);
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
				...context,
			};
			schedulerOptions.message_type = 'interactive';
			message_id = await schedulerService.schedule(recipient, msgObj, schedulerOptions);
		} else if (node.node_type === 'flowNode') {
			try {
				const details = await whatsappFlow.getWhatsappFlowContents(node.data.flow_id);

				const msgObj = {
					messaging_product: 'whatsapp',
					to: recipient,
					type: 'interactive',
					interactive: {
						type: 'flow',
						...generateListBody(node.data),
						action: {
							name: 'flow',
							parameters: {
								flow_message_version: '3',
								flow_action: 'navigate',
								flow_token: `wautopilot_${node.data.flow_id}_${node.data.button.id}`,
								flow_id: node.data.flow_id,
								flow_cta: node.data.button.text,
								flow_action_payload: {
									screen: details[0].id,
								},
							},
						},
					},
					...context,
				};
				schedulerOptions.message_type = 'interactive';
				message_id = await schedulerService.schedule(recipient, msgObj, schedulerOptions);
			} catch (err) {}
		} else if (node.node_type === 'locationRequestNode') {
			try {
				const msgObj = {
					messaging_product: 'whatsapp',
					to: recipient,
					type: 'interactive',
					interactive: {
						type: 'location_request_message',
						body: {
							text: node.data.label,
						},
						action: {
							name: 'send_location',
						},
					},
					...context,
				};
				schedulerOptions.message_type = 'interactive';
				message_id = await schedulerService.schedule(recipient, msgObj, schedulerOptions);
			} catch (err) {}
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

	static async getFlowMessageDoc(meta_message_id: string) {
		const flowMessage = await FlowMessageDB.findOne({ meta_message_id });
		if (!flowMessage) {
			return null;
		}
		return flowMessage;
	}
}

function instanceOfChatbot(object: any): object is IChatBot {
	return 'startAt' in object || 'endAt' in object || 'trigger_gap_seconds' in object;
}
