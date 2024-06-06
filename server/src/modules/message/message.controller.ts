import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../../errors';
import COMMON_ERRORS from '../../errors/common-errors';
import BroadcastService from '../../services/broadcast';
import { Respond } from '../../utils/ExpressUtils';
import { CreateBroadcastValidationResult } from './message.validator';
export const JWT_EXPIRE_TIME = 3 * 60 * 1000;
export const SESSION_EXPIRE_TIME = 28 * 24 * 60 * 60 * 1000;

async function sendTemplateMessage(req: Request, res: Response, next: NextFunction) {
	const { components, description, name, template_id, template_name, to, broadcast_options } = req
		.locals.data as CreateBroadcastValidationResult;

	try {
		const broadcastService = new BroadcastService(req.locals.account, req.locals.device);

		const messages = to.map((number) => {
			return {
				to: number,
				messageObject: {
					template_name,
					to: number,
					components,
				},
			};
		});

		await broadcastService.startBroadcast(
			{
				description,
				name,
				template_id,
				template_name,
				messages,
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
