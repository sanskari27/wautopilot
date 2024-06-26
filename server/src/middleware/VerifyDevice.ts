import { NextFunction, Request, Response } from 'express';
import { AUTH_ERRORS, CustomError } from '../errors';
import WhatsappLinkService from '../services/whatsappLink';
import { idValidator } from '../utils/ExpressUtils';

export default async function VerifyDevice(req: Request, res: Response, next: NextFunction) {
	const device_id = req.params.device_id;
	const [valid, id] = idValidator(device_id);

	if (!valid) {
		return next(new CustomError(AUTH_ERRORS.DEVICE_NOT_FOUND));
	}

	try {
		const device = await WhatsappLinkService.fetchDeviceDoc(id, req.locals.user.userId);
		if (!device) {
			return next(new CustomError(AUTH_ERRORS.DEVICE_NOT_FOUND));
		}

		req.locals.device = new WhatsappLinkService(req.locals.account, device);
		next();
	} catch (err) {
		return next(new CustomError(AUTH_ERRORS.DEVICE_NOT_FOUND));
	}
}
