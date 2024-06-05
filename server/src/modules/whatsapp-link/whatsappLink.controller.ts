import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../../errors';
import COMMON_ERRORS from '../../errors/common-errors';
import WhatsappLinkService from '../../services/whatsappLink';
import { Respond } from '../../utils/ExpressUtils';
import { WhatsappLinkCreateValidationResult } from './whatsappLink.validator';
export const JWT_EXPIRE_TIME = 3 * 60 * 1000;
export const SESSION_EXPIRE_TIME = 28 * 24 * 60 * 60 * 1000;

async function getAllLinkedDevices(req: Request, res: Response, next: NextFunction) {
	try {
		const whatsappLinkService = new WhatsappLinkService(req.locals.account);
		const devices = await whatsappLinkService.fetchRecords();

		return Respond({
			res,
			status: 200,
			data: {
				devices,
			},
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}
async function linkDevice(req: Request, res: Response, next: NextFunction) {
	const data = req.locals.data as WhatsappLinkCreateValidationResult;
	try {
		const whatsappLinkService = new WhatsappLinkService(req.locals.account);
		const device = await whatsappLinkService.addRecord(data);
		return Respond({
			res,
			status: 200,
			data: {
				device,
			},
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.ALREADY_EXISTS));
	}
}
async function removeDevice(req: Request, res: Response, next: NextFunction) {
	const id = req.locals.id;

	try {
		const whatsappLinkService = new WhatsappLinkService(req.locals.account);
		await whatsappLinkService.deleteRecord(id);
		return Respond({
			res,
			status: 200,
			data: {},
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

const Controller = {
	linkDevice,
	getAllLinkedDevices,
	removeDevice,
};

export default Controller;
