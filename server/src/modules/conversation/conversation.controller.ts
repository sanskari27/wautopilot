import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { QuickReplyDB } from '../../../mongo';
import MetaAPI from '../../config/MetaAPI';
import { UserLevel } from '../../config/const';
import { AUTH_ERRORS, CustomError } from '../../errors';
import COMMON_ERRORS from '../../errors/common-errors';
import {
	FlowMessage,
	InteractiveMediaMessage,
	LocationRequestMessage,
	TemplateMessage,
} from '../../models/message';
import TemplateFactory from '../../models/templates/templateFactory';
import ConversationService from '../../services/conversation';
import MessageSender from '../../services/messageSender';
import PhoneBookService, { IPhonebookRecord } from '../../services/phonebook';
import WhatsappFlowService from '../../services/wa_flow';
import CSVHelper from '../../utils/CSVHelper';
import DateUtils from '../../utils/DateUtils';
import { generateText, Respond, RespondCSV } from '../../utils/ExpressUtils';
import {
	extractFormattedMessage,
	generateButtons,
	generateSections,
	parseToBodyVariables,
} from '../../utils/MessageHelper';
import {
	NumbersValidationResult,
	SendMessageValidationResult,
	SendQuickReplyValidationResult,
} from './conversation.validator';

async function fetchConversations(req: Request, res: Response, next: NextFunction) {
	const labels = req.query.labels ? (req.query.labels as string).split(',') : [];
	const {
		serviceAccount: account,
		user,
		device: { device },
	} = req.locals;

	const conversationService = new ConversationService(account, device);
	const opts = user.userLevel === UserLevel.Agent ? { agent_id: user.userId } : {};
	const conversations = await conversationService.fetchConversations(labels, opts);

	return Respond({
		res,
		status: 200,
		data: { conversations },
	});
}

async function fetchConversationMessages(req: Request, res: Response, next: NextFunction) {
	const {
		serviceAccount: account,
		id,
		device: { device },
	} = req.locals;
	const page = parseInt((req.query.page as string) ?? 1);
	const limit = parseInt((req.query.limit as string) ?? 50);

	const conversationService = new ConversationService(account, device);
	const messages = await conversationService.fetchConversationMessages(id, {
		page,
		limit,
	});
	const expiry = await conversationService.fetchConversationExpiry(id);

	return Respond({
		res,
		status: 200,
		data: { messages, expiry },
	});
}

async function assignLabelToMessage(req: Request, res: Response, next: NextFunction) {
	const {
		serviceAccount: account,
		device: { device },
		id,
	} = req.locals;

	try {
		const conversationService = new ConversationService(account, device);
		await conversationService.assignLabelToMessage(id, req.locals.data.labels as string[]);

		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function sendMessageToConversation(req: Request, res: Response, next: NextFunction) {
	const {
		serviceAccount,
		serviceUser,
		id,
		user,
		device: { device },
	} = req.locals;
	const data = req.locals.data as SendMessageValidationResult;

	if (serviceAccount.walletBalance < serviceAccount.markupPrice) {
		return next(new CustomError(COMMON_ERRORS.INSUFFICIENT_BALANCE));
	}

	const conversationService = new ConversationService(serviceAccount, device);
	const recipient = await conversationService.findRecipientByConversation(id);
	if (!recipient) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}

	const msgObj: any = {
		messaging_product: 'whatsapp',
		to: recipient,
		type: data.type as string,
		[data.type]:
			data.type === 'text'
				? {
						body: data.text,
				  }
				: ['image', 'video', 'document', 'audio'].includes(data.type)
				? {
						id: data.media_id,
				  }
				: data.type === 'location'
				? data.location
				: data.contacts,
		context: data.context,
	};

	try {
		const { data: res } = await MetaAPI(device.accessToken).post(
			`/${device.phoneNumberId}/messages`,
			msgObj
		);

		await conversationService.addMessageToConversation(id, {
			message_id: res.messages[0].id,
			recipient: recipient,
			body: {
				body_type:
					data.type === 'text'
						? 'TEXT'
						: data.type === 'contacts'
						? 'CONTACT'
						: data.type === 'location'
						? 'LOCATION'
						: 'MEDIA',
				media_id: ['image', 'video', 'document', 'audio'].includes(data.type)
					? data.media_id
					: undefined,
				text: data.text,
				contacts: data.contacts,
				location: data.location,
			},
			...(data.context
				? {
						context: {
							id: data.context.message_id,
						},
				  }
				: {}),
			sender: {
				id: user.userId,
				name: user.account.name,
			},
			message_type: 'normal',
		});
		serviceUser.deductCredit(1);
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR));
	}

	return Respond({
		res,
		status: 200,
	});
}

async function sendQuickReply(req: Request, res: Response, next: NextFunction) {
	const {
		serviceAccount,
		serviceUser,
		id,
		user,
		device: { device },
	} = req.locals;
	const data = req.locals.data as SendQuickReplyValidationResult;
	const conversationService = new ConversationService(serviceAccount, device);
	const recipient = await conversationService.findRecipientByConversation(id);
	if (!recipient) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}

	if (serviceAccount.walletBalance < serviceAccount.markupPrice) {
		return next(new CustomError(COMMON_ERRORS.INSUFFICIENT_BALANCE));
	}

	let message:
		| FlowMessage
		| InteractiveMediaMessage
		| LocationRequestMessage
		| TemplateMessage
		| undefined;

	let formattedMessage: ReturnType<typeof extractFormattedMessage> | undefined;

	if (data.type === 'quickReply') {
		const quickReply = await QuickReplyDB.findById(data.quickReply);
		if (!quickReply) {
			return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
		}

		if (quickReply.type === 'flow') {
			const whatsappFlow = new WhatsappFlowService(serviceAccount, device);

			const fDetails = await whatsappFlow.getWhatsappFlowContents(quickReply.data.flow_id);

			const msg = new FlowMessage(recipient)
				.setTextHeader(quickReply.data.header)
				.setBody(quickReply.data.body)
				.setFooter(quickReply.data.footer)
				.setFlowDetails(
					quickReply.data.flow_id,
					quickReply.data.button_text,
					fDetails[0]?.id || ''
				);

			message = msg;
		} else if (quickReply.type === 'button') {
			const msg = new InteractiveMediaMessage(recipient, 'none')
				.setTextHeader(quickReply.data.header)
				.setBody(quickReply.data.body)
				.setButtons(
					generateButtons(
						quickReply.data.buttons.map((item: any) => ({
							id: generateText(2),
							text: item,
						}))
					)
				);
			message = msg;
		} else if (quickReply.type === 'list') {
			const msg = new InteractiveMediaMessage(recipient, 'none');
			msg.setTextHeader(quickReply.data.header);
			msg.setBody(quickReply.data.body);
			msg.setFooter(quickReply.data.footer);
			msg.setSections(generateSections(quickReply.data.sections));
			msg.setInteractiveType('list');

			message = msg;
		} else if (quickReply.type === 'location') {
			const msg = new LocationRequestMessage(recipient).setBody(quickReply.data.body);

			message = msg;
		} else {
			return next(new CustomError(COMMON_ERRORS.INVALID_FIELDS));
		}

		formattedMessage = extractFormattedMessage(message.toObject());
	} else if (data.type === 'template') {
		const phoneBookService = new PhoneBookService(serviceAccount);
		const { header, body, template_name, buttons, carousel } = data;
		const template = await TemplateFactory.findByName(device, template_name);

		if (!template) {
			return next(new CustomError(COMMON_ERRORS.INVALID_FIELDS));
		}

		const tHeader = template.getHeader();
		const tButtons = template.getURLButtonsWithVariable();
		const tCarousel = template.getCarouselCards();

		const msg = new TemplateMessage(recipient, template);

		const fields = await phoneBookService.findRecordByPhone(recipient);

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

		message = msg;

		formattedMessage = extractFormattedMessage(message.toObject().template, {
			template: template.buildToSave(),
			type: 'template',
		});
	}

	if (!message) {
		return next(new CustomError(COMMON_ERRORS.INVALID_FIELDS));
	}
	const messageSender = new MessageSender(device);
	try {
		const data = await messageSender.sendMessage(message);

		await conversationService.addMessageToConversation(id, {
			...data,
			recipient: recipient,
			...(formattedMessage ? { ...(formattedMessage as any) } : {}),
			sender: {
				id: user.userId,
				name: user.account.name,
			},
			message_type: 'interactive',
		});

		serviceUser.deductCredit(1);
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR));
	}

	return Respond({
		res,
		status: 200,
	});
}

async function assignConversationToAgent(req: Request, res: Response, next: NextFunction) {
	const {
		serviceAccount: account,
		device: { device },
		id,
		agent_id,
	} = req.locals;

	const conversationService = new ConversationService(account, device);
	await conversationService.assignConversationToAgent(agent_id, id);

	return Respond({
		res,
		status: 200,
	});
}

async function bulkAssignConversationToAgent(req: Request, res: Response, next: NextFunction) {
	const {
		serviceAccount: account,
		device: { device },
		agent_id,
	} = req.locals;

	const { phonebook_ids, numbers } = req.locals.data as NumbersValidationResult;

	const conversationService = new ConversationService(account, device);
	const phoneBookService = new PhoneBookService(account);
	if (phonebook_ids.length > 0) {
		const records = await phoneBookService.findRecordsByIds(phonebook_ids);
		const numbers = records.map((record) => record.phone_number);
		await conversationService.assignNumbersToAgent(agent_id, numbers);
	} else if (numbers.length > 0) {
		await conversationService.assignNumbersToAgent(agent_id, numbers);
	}

	return Respond({
		res,
		status: 200,
	});
}

async function transferAgentConversation(req: Request, res: Response, next: NextFunction) {
	const {
		serviceAccount: account,
		device: { device },
		agent_id,
	} = req.locals;

	const id = req.params.id;

	const conversationService = new ConversationService(account, device);
	await conversationService.transferConversations(agent_id, id ? String(id) : undefined);

	return Respond({
		res,
		status: 200,
	});
}

async function removeConversationFromAgent(req: Request, res: Response, next: NextFunction) {
	const {
		serviceAccount: account,
		user,
		device: { device },
		id,
	} = req.locals;

	if (user.userLevel <= UserLevel.Agent) {
		return next(new CustomError(AUTH_ERRORS.PERMISSION_DENIED));
	}

	const conversationService = new ConversationService(account, device);
	await conversationService.removeConversationFromAgent(id);

	return Respond({
		res,
		status: 200,
	});
}

async function exportConversationsFromPhonebook(req: Request, res: Response, next: NextFunction) {
	const {
		serviceAccount: account,
		user,
		device: { device },
		data,
	} = req.locals;

	if (user.userLevel <= UserLevel.Agent) {
		return next(new CustomError(AUTH_ERRORS.PERMISSION_DENIED));
	}
	const phoneBookService = new PhoneBookService(account);

	const records = await phoneBookService.findRecordsByIds(data as Types.ObjectId[]);
	const numbers = records.map((record) => record.phone_number);
	if (numbers.length === 0) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}

	const conversationService = new ConversationService(account, device);

	const dataPromise = numbers.map(async (number) => {
		const conversation = await conversationService.findConversation(number);
		if (!conversation) {
			return [];
		}

		const messages = await conversationService.fetchConversationMessages(conversation._id);

		const parsableData = messages.map((message) => {
			return {
				recipient: message.recipient,
				recipient_name: conversation.profile_name,
				header_type: message.header_type,
				header_content: message.header_type === 'TEXT' ? message.header_content : '',
				body_type: message.body?.body_type,
				body:
					message.body?.body_type === 'TEXT'
						? message.body.text
						: message.body?.body_type === 'LOCATION'
						? `Latitude: ${message.body.location.latitude} \nLongitude: ${message.body.location.longitude}`
						: '',
				footer: message.footer_content,
				buttonsCount: message.buttons?.length ?? 0,
				sent_at: message.sent_at
					? DateUtils.getMoment(message.sent_at).format('DD/MM/YYYY HH:mm:ss')
					: '',
				delivered_at: message.delivered_at
					? DateUtils.getMoment(message.delivered_at).format('DD/MM/YYYY HH:mm:ss')
					: '',
				read_at: message.read_at
					? DateUtils.getMoment(message.read_at).format('DD/MM/YYYY HH:mm:ss')
					: '',
				seen_at: message.seen_at
					? DateUtils.getMoment(message.seen_at).format('DD/MM/YYYY HH:mm:ss')
					: '',
				received_at: message.received_at
					? DateUtils.getMoment(message.received_at).format('DD/MM/YYYY HH:mm:ss')
					: '',
				failed_at: message.failed_at
					? DateUtils.getMoment(message.failed_at).format('DD/MM/YYYY HH:mm:ss')
					: '',
				failed_reason: message.failed_reason,
				sent_by: message.sender?.name ?? '',
				tags: (message.labels ?? []).join(','),
			};
		});

		return parsableData;
	});

	const conversationsData = (await Promise.all(dataPromise)).flat();

	return RespondCSV({
		res,
		filename: `conversations.csv`,
		data: CSVHelper.exportConversation(conversationsData),
	});
}

async function addNote(req: Request, res: Response, next: NextFunction) {
	const {
		serviceAccount: account,
		device: { device },
		id,
	} = req.locals;
	const note = req.body.note;
	if (note === undefined) {
		return next(new CustomError(COMMON_ERRORS.INVALID_FIELDS));
	}
	const conversationService = new ConversationService(account, device);
	await conversationService.setNote(id, note);

	return Respond({
		res,
		status: 200,
	});
}

async function getNote(req: Request, res: Response, next: NextFunction) {
	const {
		serviceAccount: account,
		device: { device },
		id,
	} = req.locals;

	try {
		const conversationService = new ConversationService(account, device);
		const note = await conversationService.getNote(id);

		return Respond({
			res,
			status: 200,
			data: { note },
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function toggleConversationPin(req: Request, res: Response, next: NextFunction) {
	const {
		serviceAccount: account,
		device: { device },
		id,
	} = req.locals;

	try {
		const conversationService = new ConversationService(account, device);
		await conversationService.toggleConversationPin(id);

		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		if (err instanceof CustomError) {
			return next(err);
		}
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR));
	}
}

async function toggleConversationArchive(req: Request, res: Response, next: NextFunction) {
	const {
		serviceAccount: account,
		device: { device },
		id,
	} = req.locals;

	try {
		const conversationService = new ConversationService(account, device);
		await conversationService.toggleConversationArchive(id);

		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		if (err instanceof CustomError) {
			return next(err);
		}
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR));
	}
}

async function markConversationRead(req: Request, res: Response, next: NextFunction) {
	const {
		serviceAccount: account,
		device: { device },
		id,
	} = req.locals;

	try {
		const conversationService = new ConversationService(account, device);
		await conversationService.markConversationRead(id);

		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		if (err instanceof CustomError) {
			return next(err);
		}
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR));
	}
}

const Controller = {
	fetchConversations,
	fetchConversationMessages,
	assignConversationToAgent,
	bulkAssignConversationToAgent,
	transferAgentConversation,
	removeConversationFromAgent,
	assignLabelToMessage,
	sendMessageToConversation,
	sendQuickReply,
	exportConversationsFromPhonebook,
	addNote,
	getNote,
	toggleConversationPin,
	toggleConversationArchive,
	markConversationRead,
};

export default Controller;
