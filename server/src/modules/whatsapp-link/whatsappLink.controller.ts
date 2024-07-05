import { NextFunction, Request, Response } from 'express';
import MetaAPI from '../../config/MetaAPI';
import { UserLevel } from '../../config/const';
import { CustomError } from '../../errors';
import COMMON_ERRORS from '../../errors/common-errors';
import WhatsappLinkService from '../../services/whatsappLink';
import { Respond } from '../../utils/ExpressUtils';
import { WhatsappLinkCreateValidationResult } from './whatsappLink.validator';

async function getAllLinkedDevices(req: Request, res: Response, next: NextFunction) {
	try {
		//TODO: Implement for agents too
		const devices = await WhatsappLinkService.fetchRecords(req.locals.serviceAccount._id);

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
	const {
		user: { userId, userLevel },
	} = req.locals;
	const data = req.locals.data as WhatsappLinkCreateValidationResult;
	const { phoneNumberId, waid, code } = data;
	let { accessToken } = data;

	if (userLevel < UserLevel.Admin) {
		return next(new CustomError(COMMON_ERRORS.PERMISSION_DENIED));
	}

	const userDetails = await req.locals.user.getDetails();

	const devices = await WhatsappLinkService.fetchRecords(userId);

	if (devices.length >= userDetails.no_of_devices) {
		return next(new CustomError(COMMON_ERRORS.PERMISSION_DENIED));
	}

	if (code) {
		try {
			const { data } = await MetaAPI().get(
				`/oauth/access_token?client_id=3850065088596673&client_secret=ffb5e1c194cbc07e8ccaabed534e6a0d&code=${code}`
			);
			accessToken = data.access_token;

			await MetaAPI(accessToken).post(`/${phoneNumberId}/register`, {
				messaging_product: 'whatsapp',
				pin: '000000',
			});
		} catch (err) {
			return next(new CustomError(COMMON_ERRORS.INVALID_FIELDS));
		}
	}

	if (!accessToken) {
		return next(new CustomError(COMMON_ERRORS.INVALID_FIELDS));
	}

	try {
		const device = await WhatsappLinkService.addRecord(userId, {
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
		return next(new CustomError(COMMON_ERRORS.ALREADY_EXISTS));
	}
}
async function removeDevice(req: Request, res: Response, next: NextFunction) {
	const { id, serviceAccount: account } = req.locals;

	try {
		await WhatsappLinkService.deleteRecord(account._id, id);
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
	const {
		device: { device },
		serviceAccount: account,
	} = req.locals;

	try {
		return Respond({
			res,
			status: 200,
			data: {
				health: await new WhatsappLinkService(account, device).fetchMessageHealth(),
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
