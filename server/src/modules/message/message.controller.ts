import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../../errors';
import COMMON_ERRORS from '../../errors/common-errors';
import BroadcastService from '../../services/broadcast';
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
	const { body, description, name, template_id, template_name, to, broadcast_options, labels } = req
		.locals.data as CreateBroadcastValidationResult;

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

const Controller = {
	sendTemplateMessage,
};

export default Controller;
