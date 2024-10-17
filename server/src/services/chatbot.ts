import { Types } from 'mongoose';
import { ConversationMessageDB } from '../../mongo';
import ChatBotFlowDB, { ChatBotFlowDB_name } from '../../mongo/repo/ChatbotFlow';
import FlowMessageDB from '../../mongo/repo/FlowMessages';
import IAccount from '../../mongo/types/account';
import IChatBotFlow from '../../mongo/types/chatbotFlow';
import IContact from '../../mongo/types/contact';
import IFlowMessage from '../../mongo/types/flowMessage';
import IMedia from '../../mongo/types/media';
import IWhatsappLink from '../../mongo/types/whatsappLink';
import { BOT_TRIGGER_OPTIONS } from '../config/const';
import { CustomError } from '../errors';
import COMMON_ERRORS from '../errors/common-errors';
import {
	ContactMessage,
	FlowMessage,
	InteractiveMediaMessage,
	LocationRequestMessage,
	MediaMessage,
	Message,
	TemplateMessage,
	TextMessage,
} from '../models/message';
import TemplateFactory from '../models/templates/templateFactory';
import DateUtils from '../utils/DateUtils';
import { Delay, filterUndefinedKeys } from '../utils/ExpressUtils';
import {
	extractFormattedMessage,
	generateButtons,
	generateSections,
	parseToBodyVariables,
	parseVariables,
} from '../utils/MessageHelper';
import TimeGenerator from '../utils/TimeGenerator';
import MediaService from './media';
import MessageScheduler from './messageScheduler';
import PhoneBookService, { IPhonebookRecord } from './phonebook';
import WhatsappFlowService from './wa_flow';
import WhatsappLinkService from './whatsappLink';

type CreateFlowData = {
	name: string;
	options: BOT_TRIGGER_OPTIONS;
	trigger: string[];
	startAt: string;
	endAt: string;
	trigger_gap_seconds: number;
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
			| 'templateNode'
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
			text?: {
				custom_text: string;
				phonebook_data: string;
				variable_from: 'custom_text' | 'phonebook_data';
				fallback_value: string;
			}[];
			media_id?: string;
			link?: string;
		};
		template_body: {
			custom_text: string;
			phonebook_data: string;
			variable_from: 'custom_text' | 'phonebook_data';
			fallback_value: string;
		}[];
		template_buttons?: string[][];
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
	}[];
	forward: { number: string; message: string };
};

type TemplateNode = {
	template_id: string;
	template_name: string;
	header?: {
		type: 'IMAGE' | 'TEXT' | 'VIDEO' | 'DOCUMENT';
		text?: {
			custom_text: string;
			phonebook_data: string;
			variable_from: 'custom_text' | 'phonebook_data';
			fallback_value: string;
		}[];
		media_id?: string;
		link?: string;
	};
	body: {
		custom_text: string;
		phonebook_data: string;
		variable_from: 'custom_text' | 'phonebook_data';
		fallback_value: string;
	}[];
	buttons: string[][];
	carousel?: {
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
};

function processFlowDocs(docs: IChatBotFlow[]) {
	return docs.map((bot) => {
		return {
			bot_id: bot._id as Types.ObjectId,
			name: bot.name,
			trigger: bot.trigger,
			options: bot.options,
			startAt: bot.startAt,
			endAt: bot.endAt,
			trigger_gap_seconds: bot.trigger_gap_seconds,
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
			text?: {
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
		template_buttons?: string[][];
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
	}[];
};

export default class ChatBotService extends WhatsappLinkService {
	public constructor(user: IAccount, device: IWhatsappLink) {
		super(user, device);
	}

	public async toggleActive(id: Types.ObjectId) {
		const { matchedCount } = await ChatBotFlowDB.updateOne(
			{ _id: id, linked_to: this.userId, device_id: this.deviceId },
			{
				$set: {
					active: {
						$not: '$active',
					},
				},
			}
		);
		if (matchedCount === 0) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}
	}

	public async pauseAll() {
		await ChatBotFlowDB.updateMany(
			{ linked_to: this.userId, device_id: this.deviceId },
			{ active: false }
		);
	}

	public async deleteBot(bot_id: Types.ObjectId) {
		await ChatBotFlowDB.deleteMany({ _id: bot_id, linked_to: this.userId });
	}

	public async botResponses(bot_id: Types.ObjectId) {
		let bot = await ChatBotFlowDB.findById(bot_id);
		if (!bot) {
			return [];
		}
		const responses = await ConversationMessageDB.find({
			linked_to: this.userId,
			device_id: this.deviceId,
			scheduled_by: {
				id: bot_id,
				name: ChatBotFlowDB_name,
			},
		});

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
		const { matchedCount } = await ChatBotFlowDB.updateOne(
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
		if (matchedCount === 0) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}
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

	private async botsEngaged({
		bots,
		message_body,
		recipient,
	}: {
		bots: IChatBotFlowPopulated[];
		message_body: string;
		recipient: string;
	}): Promise<IChatBotFlowPopulated[]> {
		if (bots.length === 0) {
			return [];
		}
		let last_messages: { [key: string]: number } = await this.lastMessages(
			bots.map((bot) => bot._id),
			recipient
		);

		return bots.filter((bot) => {
			if (!DateUtils.isTimeBetween(bot.startAt, bot.endAt, DateUtils.getMomentNow())) {
				return false;
			} else if (bot.trigger_gap_seconds > 0) {
				const last_message_time = last_messages[bot._id.toString()];
				if (!isNaN(last_message_time) && last_message_time <= bot.trigger_gap_seconds) {
					return false;
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
		const schedulerService = new MessageScheduler(this.account._id, this.device._id);
		const phonebook = new PhoneBookService(this.account);
		const contact = await phonebook.findRecordByPhone(recipient);

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

		const flowsEngaged = await this.botsEngaged({
			recipient,
			bots: flows,
			message_body: text,
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

				const msg = new TextMessage(recipient, custom_message);

				await schedulerService.scheduleMessage(msg, {
					scheduler_id: bot._id,
					scheduler_type: ChatBotFlowDB_name,
					sendAt: DateUtils.getMomentNow().toDate(),
					formattedMessage: extractFormattedMessage(msg.toObject()),
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
		const schedulerService = new MessageScheduler(this.account._id, this.device._id);
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
					this.sendDirectBotMessage(
						recipient,
						{
							audios: el.audios,
							documents: el.documents,
							images: el.images,
							message: el.message,
							videos: el.videos,
							contacts: el.contacts,
							_id: details.bot._id,
						},

						{
							meta_message_id: details.meta_message_id,
							contact,
							sendAt: dateGenerator.next(el.after).value,
						}
					);
				} else if (el.respond_type === 'template' && el.template_id) {
					const template = await TemplateFactory.findById(this.device, el.template_id);
					if (!template || !contact) {
						return;
					}

					const header = template.getHeader();
					const tButtons = template.getURLButtonsWithVariable();
					const tCarousel = template.getCarouselCards();

					const msg = new TemplateMessage(recipient, template);

					if (header && el.template_header) {
						if (
							header.format !== 'TEXT' &&
							('link' in el.template_header || 'media_id' in el.template_header)
						) {
							msg.setMediaHeader(el.template_header as any);
						} else if (el.template_header.text && header?.example.length > 0) {
							const headerVariables = parseToBodyVariables({
								variables: el.template_header.text,
								fields: contact,
							});
							msg.setTextHeader(headerVariables);
						}
					}

					const bodyVariables = parseToBodyVariables({
						variables: el.template_body,
						fields: contact,
					});
					msg.setBody(bodyVariables);

					if (tButtons.length > 0) {
						msg.setButtons(el?.template_buttons ?? []);
					}

					if (tCarousel.length > 0 && el.template_carousel) {
						const cards = el.template_carousel.cards.map((card, index) => {
							const bodyVariables = parseToBodyVariables({
								variables: card.body,
								fields: contact,
							});
							return {
								header: card.header,
								body: bodyVariables,
								buttons: card.buttons,
							};
						});
						msg.setCarousel(cards);
					}

					schedulerService.scheduleMessage(msg, {
						...schedulerOptions,
						formattedMessage: extractFormattedMessage(msg.toObject().template, {
							template: template.buildToSave(),
							type: 'template',
						}),
					});
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
		const schedulerService = new MessageScheduler(this.account._id, this.device._id);
		const whatsappFlow = new WhatsappFlowService(this.account, this.device);
		const mediaService = new MediaService(this.account, this.device);
		const phoneBookService = new PhoneBookService(this.account);
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
		let message_id: Types.ObjectId;
		const schedulerOptions = {
			scheduler_id: bot_id,
			scheduler_type: ChatBotFlowDB_name,
			sendAt: DateUtils.getMomentNow().add(delay, 'seconds').toDate(),
			message_type: 'normal' as 'interactive' | 'normal' | 'template',
		};

		if (node.node_type === 'textNode') {
			const msg = new TextMessage(recipient, node.data.label);

			if (node.data.reply_to_message && details?.meta_message_id) {
				msg.setContextMessage(details.meta_message_id);
			}

			message_id = await schedulerService.scheduleMessage(msg, {
				...schedulerOptions,
				formattedMessage: extractFormattedMessage(msg.toObject()),
			});
		} else if (node.node_type === 'contactNode') {
			const { id, formatted_name, ...contact } = node.data.contact;
			const msg = new ContactMessage(recipient, contact);

			if (node.data.reply_to_message && details?.meta_message_id) {
				msg.setContextMessage(details.meta_message_id);
			}

			message_id = await schedulerService.scheduleMessage(msg, {
				...schedulerOptions,
				formattedMessage: extractFormattedMessage(msg.toObject()),
			});
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

			const msg = new MediaMessage(recipient, type);
			const media = await mediaService.getMedia(node.data.id);
			msg.setMediaId(media.media_id);
			msg.setCaption(node.data.caption);

			if (node.data.reply_to_message && details?.meta_message_id) {
				msg.setContextMessage(details.meta_message_id);
			}

			message_id = await schedulerService.scheduleMessage(msg, {
				...schedulerOptions,
				formattedMessage: extractFormattedMessage(msg.toObject()),
			});
		} else if (node.node_type === 'buttonNode') {
			const msg = new InteractiveMediaMessage(recipient, 'none');
			msg.setBody(node.data.text);
			msg.setButtons(generateButtons(node.data.buttons));

			if (node.data.reply_to_message && details?.meta_message_id) {
				msg.setContextMessage(details.meta_message_id);
			}

			message_id = await schedulerService.scheduleMessage(msg, {
				...schedulerOptions,
				formattedMessage: extractFormattedMessage(msg.toObject()),
			});
		} else if (node.node_type === 'listNode') {
			const msg = new InteractiveMediaMessage(recipient, 'none');
			msg.setTextHeader(node.data.header);
			msg.setBody(node.data.body);
			msg.setFooter(node.data.footer);
			msg.setSections(generateSections(node.data.sections));
			msg.setInteractiveType('list');

			if (node.data.reply_to_message && details?.meta_message_id) {
				msg.setContextMessage(details.meta_message_id);
			}

			message_id = await schedulerService.scheduleMessage(msg, {
				...schedulerOptions,
				formattedMessage: extractFormattedMessage(msg.toObject()),
			});
		} else if (node.node_type === 'flowNode') {
			const fDetails = await whatsappFlow.getWhatsappFlowContents(node.data.flow_id);

			const msg = new FlowMessage(recipient)
				.setTextHeader(node.data.header)
				.setBody(node.data.text)
				.setFooter(node.data.footer)
				.setFlowDetails(node.data.flow_id, node.data.button.text, fDetails[0]?.id || '');

			if (node.data.reply_to_message && details?.meta_message_id) {
				msg.setContextMessage(details.meta_message_id);
			}

			message_id = await schedulerService.scheduleMessage(msg, {
				...schedulerOptions,
				formattedMessage: extractFormattedMessage(msg.toObject()),
			});
		} else if (node.node_type === 'locationRequestNode') {
			const msg = new LocationRequestMessage(recipient).setBody(node.data.label);

			if (node.data.reply_to_message && details?.meta_message_id) {
				msg.setContextMessage(details.meta_message_id);
			}

			message_id = await schedulerService.scheduleMessage(msg, {
				...schedulerOptions,
				formattedMessage: extractFormattedMessage(msg.toObject()),
			});
		} else if (node.node_type === 'templateNode') {
			const { body, buttons, carousel, header, template_id } = node.data as TemplateNode;
			const template = await TemplateFactory.findById(this.device, template_id);
			if (!template) {
				return;
			}

			const msg = new TemplateMessage(recipient, template);
			const fields = await phoneBookService.findRecordByPhone(recipient);

			const tHeader = template.getHeader();
			const tButtons = template.getURLButtonsWithVariable();
			const tCarousel = template.getCarouselCards();

			if (header && tHeader && tHeader.format !== 'TEXT') {
				msg.setMediaHeader(header as any);
			} else if (header?.text && tHeader && tHeader.format === 'TEXT') {
				if (tHeader?.example.length > 0) {
					const headerVariables = parseToBodyVariables({
						variables: header.text,
						fields: fields || ({} as IPhonebookRecord),
					});
					msg.setTextHeader(headerVariables);
				}
			}

			const bodyVariables = parseToBodyVariables({
				variables: body,
				fields: fields || ({} as IPhonebookRecord),
			});

			msg.setBody(bodyVariables);

			if (tButtons.length > 0) {
				msg.setButtons(buttons);
			}

			if (tCarousel.length > 0 && carousel) {
				const cards = carousel.cards.map((card, index) => {
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

			message_id = await schedulerService.scheduleMessage(msg, {
				...schedulerOptions,
				formattedMessage: extractFormattedMessage(msg.toObject().template, {
					template: template.buildToSave(),
					type: 'template',
				}),
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

	static async getFlowDocByMessageId(meta_message_id: string) {
		const flowMessage = await FlowMessageDB.findOne({ meta_message_id });
		if (!flowMessage) {
			return null;
		}
		const flow = await ChatBotFlowDB.findById(flowMessage.bot_id);
		if (!flow) {
			return null;
		}
		return [flow, flowMessage] as [IChatBotFlow, IFlowMessage];
	}

	private async sendDirectBotMessage(
		recipient: string,
		bot: {
			_id: Types.ObjectId;
			message: string;
			images: IMedia[];
			videos: IMedia[];
			audios: IMedia[];
			documents: IMedia[];
			contacts: IContact[];
			reply_to_message?: boolean;
		},
		opts: {
			contact:
				| (IPhonebookRecord & {
						id: Types.ObjectId;
				  })
				| null;
			meta_message_id?: string;
			sendAt?: Date;
		}
	) {
		const schedulerService = new MessageScheduler(this.account._id, this.device._id);

		const schedulerOptions = {
			scheduler_id: bot._id,
			scheduler_type: `${ChatBotFlowDB_name} Nurturing`,
			sendAt: opts.sendAt || DateUtils.getMomentNow().toDate(),
		};

		let msg = bot.message;
		if (msg) {
			msg = parseVariables(msg, opts.contact as unknown as Record<string, string>);
			const message = new TextMessage(recipient, msg);

			schedule(message);
		}

		for (const mediaObject of bot.images ?? []) {
			const mediaMessage = new MediaMessage(recipient, 'image').setMediaId(mediaObject.media_id);
			schedule(mediaMessage);
		}

		for (const mediaObject of bot.videos ?? []) {
			const mediaMessage = new MediaMessage(recipient, 'video').setMediaId(mediaObject.media_id);
			schedule(mediaMessage);
		}

		for (const mediaObject of bot.audios ?? []) {
			const mediaMessage = new MediaMessage(recipient, 'audio').setMediaId(mediaObject.media_id);
			schedule(mediaMessage);
		}

		for (const mediaObject of bot.documents ?? []) {
			const mediaMessage = new MediaMessage(recipient, 'document').setMediaId(mediaObject.media_id);
			schedule(mediaMessage);
		}

		(bot.contacts ?? []).forEach(async (card) => {
			const contactMessage = new ContactMessage(recipient, card);
			schedule(contactMessage);
		});
		async function schedule(message: Message) {
			if (bot.reply_to_message && opts.meta_message_id) {
				message.setContextMessage(opts.meta_message_id);
			}

			await schedulerService.scheduleMessage(message, {
				...schedulerOptions,
				formattedMessage: extractFormattedMessage(message.toObject()),
			});
		}
	}
}
