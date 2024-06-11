import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../../errors';
import COMMON_ERRORS from '../../errors/common-errors';
import BroadcastService from '../../services/broadcast';
import ConversationService from '../../services/conversation';
import PhoneBookService from '../../services/phonebook';
import { Respond } from '../../utils/ExpressUtils';
import { CreateBroadcastValidationResult } from './message.validator';
export const JWT_EXPIRE_TIME = 3 * 60 * 1000;
export const SESSION_EXPIRE_TIME = 28 * 24 * 60 * 60 * 1000;

const bodyParametersList = [
	'first_name',
	'last_name',
	'middle_name',
	'phone_number',
	'email',
	'birthday',
	'anniversary',
];

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
	const { account, device } = req.locals;

	const conversationService = new ConversationService(account, device);
	const conversations = await conversationService.fetchConversations();

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

	return Respond({
		res,
		status: 200,
		data: { messages },
	});
}

const Controller = {
	sendTemplateMessage,
	fetchConversations,
	fetchConversationMessages,
};

export default Controller;
