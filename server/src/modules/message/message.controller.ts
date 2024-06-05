import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../../errors';
import COMMON_ERRORS from '../../errors/common-errors';
import TemplateService from '../../services/templates';
import WhatsappLinkService from '../../services/whatsappLink';
import { Respond } from '../../utils/ExpressUtils';
import { SendTemplateMessageValidationResult } from './message.validator';
export const JWT_EXPIRE_TIME = 3 * 60 * 1000;
export const SESSION_EXPIRE_TIME = 28 * 24 * 60 * 60 * 1000;

async function sendTemplateMessage(req: Request, res: Response, next: NextFunction) {
	const { template_name, to, components } = req.locals.data as SendTemplateMessageValidationResult;

	try {
		const whatsappLinkService = new WhatsappLinkService(req.locals.account);
		const devices = await whatsappLinkService.fetchDeviceDoc(req.locals.id);

		const templateService = new TemplateService(req.locals.account, devices);

		const success = await templateService.sendTemplateMessage(template_name, to, components);

		if (!success) {
			return next(new CustomError(COMMON_ERRORS.INVALID_FIELDS));
		}

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
