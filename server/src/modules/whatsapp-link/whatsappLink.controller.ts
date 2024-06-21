import { NextFunction, Request, Response } from 'express';
import MetaAPI from '../../config/MetaAPI';
import { CustomError } from '../../errors';
import COMMON_ERRORS from '../../errors/common-errors';
import WhatsappLinkService from '../../services/whatsappLink';
import { Respond } from '../../utils/ExpressUtils';
import { WhatsappLinkCreateValidationResult } from './whatsappLink.validator';

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
	const { phoneNumberId, waid, code } = data;
	let { accessToken } = data;

	const userDetails = await req.locals.user.getDetails();

	const devices = await new WhatsappLinkService(req.locals.account).fetchRecords();

	if (devices.length >= userDetails.no_of_devices) {
		return next(new CustomError(COMMON_ERRORS.PERMISSION_DENIED));
	}

	if (code) {
		try {
			const { data } = await MetaAPI.get(
				`/oauth/access_token?client_id=3850065088596673&client_secret=ffb5e1c194cbc07e8ccaabed534e6a0d&code=${code}`
			);
			accessToken = data.access_token;

			await MetaAPI.post(
				`/${phoneNumberId}/register`,
				{
					messaging_product: 'whatsapp',
					pin: '000000',
				},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
		} catch (err) {
			return next(new CustomError(COMMON_ERRORS.INVALID_FIELDS));
		}
	}

	if (!accessToken) {
		return next(new CustomError(COMMON_ERRORS.INVALID_FIELDS));
	}

	try {
		const whatsappLinkService = new WhatsappLinkService(req.locals.account);
		const device = await whatsappLinkService.addRecord({
			phoneNumberId,
			waid,
			accessToken,
		});
		return Respond({
			res,
			status: 200,
			data: {
				device,
			},
		});
	} catch (err) {
		console.log(err);

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
async function fetchMessageHealth(req: Request, res: Response, next: NextFunction) {
	const { device } = req.locals;

	try {
		return Respond({
			res,
			status: 200,
			data: {
				health: await WhatsappLinkService.fetchMessageHealth(device),
			},
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

const Controller = {
	linkDevice,
	getAllLinkedDevices,
	removeDevice,
	fetchMessageHealth,
};

export default Controller;
