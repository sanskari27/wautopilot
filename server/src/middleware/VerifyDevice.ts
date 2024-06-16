import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../errors';
import COMMON_ERRORS from '../errors/common-errors';
import WhatsappLinkService from '../services/whatsappLink';
import { idValidator } from '../utils/ExpressUtils';

export default async function VerifyDevice(req: Request, res: Response, next: NextFunction) {
	const device_id = req.params.device_id;
	const [valid, id] = idValidator(device_id);

	if (!valid) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}

	const whatsappLinkService = new WhatsappLinkService(req.locals.account);
	try {
		const device = await whatsappLinkService.fetchDeviceDoc(id);

		if (!device) {
			return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
		}

		req.locals.device = device;
		next();
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}
