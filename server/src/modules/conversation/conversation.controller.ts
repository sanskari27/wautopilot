import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import MetaAPI from '../../config/MetaAPI';
import { UserLevel } from '../../config/const';
import { AUTH_ERRORS, CustomError } from '../../errors';
import COMMON_ERRORS from '../../errors/common-errors';
import ConversationService from '../../services/conversation';
import PhoneBookService from '../../services/phonebook';
import CSVHelper from '../../utils/CSVHelper';
import DateUtils from '../../utils/DateUtils';
import { Respond, RespondCSV } from '../../utils/ExpressUtils';
import { NumbersValidationResult, SendMessageValidationResult } from './conversation.validator';

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
	const labels = await conversationService.fetchMessagesLabels(id);
	const expiry = await conversationService.fetchConversationExpiry(id);

	return Respond({
		res,
		status: 200,
		data: { messages, labels, expiry },
	});
}

async function markRead(req: Request, res: Response, next: NextFunction) {
	const {
		serviceAccount: account,
		device: { device },
	} = req.locals;
	const message_id = req.params.message_id;

	try {
		await MetaAPI(device.accessToken).put(`/${device.phoneNumberId}/messages`, {
			messaging_product: 'whatsapp',
			status: 'read',
			message_id: message_id,
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}

	try {
		const conversationService = new ConversationService(account, device);
		await conversationService.markMessageRead(message_id);

		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
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

	const conversationService = new ConversationService(serviceAccount, device);
	const recipient = await conversationService.findRecipientByConversation(id);
	if (!recipient) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
	const msgObj = {
		messaging_product: 'whatsapp',
		to: recipient,
		type: data.type,
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

const Controller = {
	fetchConversations,
	fetchConversationMessages,
	assignConversationToAgent,
	bulkAssignConversationToAgent,
	transferAgentConversation,
	removeConversationFromAgent,
	markRead,
	assignLabelToMessage,
	sendMessageToConversation,
	exportConversationsFromPhonebook,
	addNote,
	getNote,
};

export default Controller;
