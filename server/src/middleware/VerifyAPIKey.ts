import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../errors';
import AUTH_ERRORS from '../errors/auth-errors';
import { UserService } from '../services';
import ApiKeyService from '../services/apiKeys';
import WhatsappLinkService from '../services/whatsappLink';

export default async function VerifyAPIKey(req: Request, res: Response, next: NextFunction) {
	const bearer = req.headers.authorization;
	const token = bearer?.split(' ')[1];

	if (!token) {
		return next(new CustomError(AUTH_ERRORS.AUTHORIZATION_ERROR));
	}
	try {
		const apiKey = await ApiKeyService.getDoc(token);

		const user = await UserService.findById(apiKey.linked_to);
		req.locals.user = req.locals.serviceUser = user;
		req.locals.serviceAccount = user.account;

		const device = await WhatsappLinkService.fetchDeviceDoc(apiKey.device, apiKey.linked_to);
		if (!device) {
			return next(new CustomError(AUTH_ERRORS.DEVICE_NOT_FOUND));
		}
		req.locals.device = new WhatsappLinkService(req.locals.serviceAccount, device);
		next();
	} catch (err) {
		return next(new CustomError(AUTH_ERRORS.AUTHORIZATION_ERROR));
	}
}
