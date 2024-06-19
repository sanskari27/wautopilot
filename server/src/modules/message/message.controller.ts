import { NextFunction, Request, Response } from 'express';
import MetaAPI from '../../config/MetaAPI';
import { CustomError } from '../../errors';
import COMMON_ERRORS from '../../errors/common-errors';
import BroadcastService from '../../services/broadcast';
import ConversationService from '../../services/conversation';
import PhoneBookService from '../../services/phonebook';
import CSVHelper from '../../utils/CSVHelper';
import { Respond, RespondCSV } from '../../utils/ExpressUtils';
import { CreateBroadcastValidationResult, SendMessageValidationResult } from './message.validator';

const bodyParametersList = [
	'first_name',
	'last_name',
	'middle_name',
	'phone_number',
	'email',
	'birthday',
	'anniversary',
];

async function broadcastReport(req: Request, res: Response, next: NextFunction) {
	try {
		const broadcastService = new BroadcastService(req.locals.account, req.locals.device);

		const reports = await broadcastService.fetchReports();

		return Respond({
			res,
			status: 200,
			data: {
				reports,
			},
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR));
	}
}

async function pauseBroadcast(req: Request, res: Response, next: NextFunction) {
	const { id } = req.locals;

	try {
		const broadcastService = new BroadcastService(req.locals.account, req.locals.device);
		await broadcastService.pauseBroadcast(id);

		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function resumeBroadcast(req: Request, res: Response, next: NextFunction) {
	const { id } = req.locals;

	try {
		const broadcastService = new BroadcastService(req.locals.account, req.locals.device);
		await broadcastService.resumeBroadcast(id);

		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function resendBroadcast(req: Request, res: Response, next: NextFunction) {
	const { id } = req.locals;

	try {
		const broadcastService = new BroadcastService(req.locals.account, req.locals.device);
		await broadcastService.resendBroadcast(id);

		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function downloadBroadcast(req: Request, res: Response, next: NextFunction) {
	const { id } = req.locals;

	try {
		const broadcastService = new BroadcastService(req.locals.account, req.locals.device);
		const records = await broadcastService.generateBroadcastReport(id);

		return RespondCSV({
			res,
			filename: `broadcast-${id}`,
			data: CSVHelper.exportBroadcastReport(records),
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function deleteBroadcast(req: Request, res: Response, next: NextFunction) {
	const { id } = req.locals;

	try {
		const broadcastService = new BroadcastService(req.locals.account, req.locals.device);
		await broadcastService.deleteBroadcast(id);

		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function sendTemplateMessage(req: Request, res: Response, next: NextFunction) {
	const {
		body,
		description,
		name,
		template_id,
		template_name,
		to,
		broadcast_options,
		labels,
		header,
	} = req.locals.data as CreateBroadcastValidationResult;

	try {
		const phoneBookService = new PhoneBookService(req.locals.account);
		const broadcastService = new BroadcastService(req.locals.account, req.locals.device);

		let _to = to;
		if (to.length === 0) {
			_to = (
				await phoneBookService.fetchRecords({
					page: 1,
					limit: 99999999,
					labels,
				})
			)
				.map((record) => record.phone_number)
				.filter((number) => number);
		}

		if (_to.length === 0) {
			return next(new CustomError(COMMON_ERRORS.INVALID_FIELDS));
		}

		const messages = _to.map(async (number) => {
			const fields = await phoneBookService.findFieldsByPhone(number);

			let headers = [] as Record<string, unknown>[];

			if (header) {
				const object = {
					...(header.media_id ? { id: header.media_id } : header.link ? { link: header.link } : {}),
				};

				headers = [
					{
						type: 'HEADER',
						parameters:
							header.type !== 'TEXT'
								? [
										{
											type: header.type,
											[header.type.toLowerCase()]: object,
										},
								  ]
								: [],
					},
				];
			}

			return {
				to: number,
				messageObject: {
					template_name,
					to: number,
					components: [
						{
							type: 'BODY',
							parameters: body.map((b) => {
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
				},
			};
		});

		await broadcastService.startBroadcast(
			{
				description,
				name,
				template_id,
				template_name,
				messages: await Promise.all(messages),
			},
			broadcast_options
		);

		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function fetchConversations(req: Request, res: Response, next: NextFunction) {
	const labels = req.query.labels ? (req.query.labels as string).split(',') : [];
	const { account, device } = req.locals;

	const conversationService = new ConversationService(account, device);
	const conversations = await conversationService.fetchConversations(labels);

	return Respond({
		res,
		status: 200,
		data: { conversations },
	});
}

async function fetchConversationMessages(req: Request, res: Response, next: NextFunction) {
	const { account, id, device } = req.locals;

	const conversationService = new ConversationService(account, device);
	const messages = await conversationService.fetchConversationMessages(id);
	const labels = await conversationService.fetchMessagesLabels(id);

	return Respond({
		res,
		status: 200,
		data: { messages, labels },
	});
}

async function markRead(req: Request, res: Response, next: NextFunction) {
	const { account, device } = req.locals;
	const message_id = req.params.message_id;

	try {
		await MetaAPI.put(
			`/${device.phoneNumberId}/messages`,
			{
				messaging_product: 'whatsapp',
				status: 'read',
				message_id: message_id,
			},
			{
				headers: {
					Authorization: `Bearer ${device.accessToken}`,
				},
			}
		);
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
	const { account, device, id } = req.locals;

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
	const { account, id, device } = req.locals;
	const data = req.locals.data as SendMessageValidationResult;

	const conversationService = new ConversationService(account, device);
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
		const { data: res } = await MetaAPI.post(`/${device.phoneNumberId}/messages`, msgObj, {
			headers: {
				Authorization: `Bearer ${device.accessToken}`,
			},
		});

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
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR));
	}

	return Respond({
		res,
		status: 200,
	});
}

const Controller = {
	sendTemplateMessage,
	broadcastReport,
	pauseBroadcast,
	resumeBroadcast,
	deleteBroadcast,
	resendBroadcast,
	downloadBroadcast,
	fetchConversations,
	fetchConversationMessages,
	markRead,
	assignLabelToMessage,
	sendMessageToConversation,
};

export default Controller;
