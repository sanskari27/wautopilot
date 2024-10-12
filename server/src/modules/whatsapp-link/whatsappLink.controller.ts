import { NextFunction, Request, Response } from 'express';
import MetaAPI from '../../config/MetaAPI';
import { Cookie, UserLevel } from '../../config/const';
import { CustomError } from '../../errors';
import COMMON_ERRORS from '../../errors/common-errors';
import WhatsappLinkService from '../../services/whatsappLink';
import { clearCookie, Respond, setCookie } from '../../utils/ExpressUtils';
import { SESSION_EXPIRE_TIME } from '../auth/auth.controller';
import { WhatsappLinkCreateValidationResult } from './whatsappLink.validator';

async function getAllLinkedDevices(req: Request, res: Response, next: NextFunction) {
	try {
		const devices = await WhatsappLinkService.fetchRecords(req.locals.serviceAccount._id);

		return Respond({
			res,
			status: 200,
			data: {
				devices,
				currentDevice: req.cookies[Cookie.Device],
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

	if (devices.length >= userDetails.max_devices) {
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
		if (!device) {
			return next(new CustomError(COMMON_ERRORS.ALREADY_EXISTS));
		}

		setCookie(res, {
			key: Cookie.Device,
			value: device.id,
			expires: SESSION_EXPIRE_TIME,
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

		if (req.cookies[Cookie.Device] === id) {
			const devices = await WhatsappLinkService.fetchRecords(account._id);
			if (devices.length > 0) {
				setCookie(res, {
					key: Cookie.Device,
					value: devices[0].id,
					expires: SESSION_EXPIRE_TIME,
				});
			} else {
				clearCookie(res, Cookie.Device);
			}
		}
		return Respond({
			res,
			status: 200,
			data: {},
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function setCurrentDevice(req: Request, res: Response, next: NextFunction) {
	const { serviceAccount: account, id } = req.locals;

	try {
		const device = await WhatsappLinkService.fetchDeviceDoc(id, account._id);
		setCookie(res, {
			key: Cookie.Device,
			value: device.id,
			expires: SESSION_EXPIRE_TIME,
		});
		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function fetchMessageHealth(req: Request, res: Response, next: NextFunction) {
	const { serviceAccount: account, id } = req.locals;

	try {
		const device = await WhatsappLinkService.fetchDeviceDoc(id, account._id);
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
	setCurrentDevice,
};

export default Controller;
