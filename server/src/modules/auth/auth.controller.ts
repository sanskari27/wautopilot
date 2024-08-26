import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { AccountDB, StorageDB } from '../../../mongo';
import { Cookie, REFRESH_SECRET, UserLevel } from '../../config/const';
import { AUTH_ERRORS, CustomError } from '../../errors';
import COMMON_ERRORS from '../../errors/common-errors';
import { sendPasswordResetEmail } from '../../provider/email';
import { UserService } from '../../services';
import WhatsappLinkService from '../../services/whatsappLink';
import { clearCookie, Respond, setCookie } from '../../utils/ExpressUtils';
import {
	LoginValidationResult,
	RegisterValidationResult,
	ResetPasswordValidationResult,
	UpdateAccountValidationResult,
	UpdatePasswordValidationResult,
} from './auth.validator';
export const JWT_EXPIRE_TIME = 3 * 60 * 1000;
export const SESSION_EXPIRE_TIME = 28 * 24 * 60 * 60 * 1000;

async function login(req: Request, res: Response, next: NextFunction) {
	const { email, password, latitude, longitude } = req.locals.data as LoginValidationResult;

	try {
		const { authToken, refreshToken, userService } = await UserService.login(email, password, {
			latitude: latitude ?? 0,
			longitude: longitude ?? 0,
			platform: req.useragent?.platform || '',
			browser: req.useragent?.browser || '',
		});

		setCookie(res, {
			key: Cookie.Auth,
			value: authToken,
			expires: JWT_EXPIRE_TIME,
		});

		setCookie(res, {
			key: Cookie.Refresh,
			value: refreshToken,
			expires: SESSION_EXPIRE_TIME,
		});

		let devices: {
			id: string;
			phoneNumber: string;
			verifiedName: string;
			phoneNumberId: string;
			waid: string;
		}[] = [];

		if (userService.userLevel >= UserLevel.Admin) {
			devices = await WhatsappLinkService.fetchRecords(userService.userId);
		} else {
			if (userService.account.parent) {
				devices = await WhatsappLinkService.fetchRecords(userService.account.parent!);
			}
		}

		if (devices.length > 0) {
			setCookie(res, {
				key: Cookie.Device,
				value: devices[0].id,
				expires: SESSION_EXPIRE_TIME,
			});
		}

		return Respond({
			res,
			status: 200,
			data: {
				isAdmin: userService.userLevel === UserLevel.Admin,
				isAgent: userService.userLevel === UserLevel.Agent,
				isMaster: userService.userLevel === UserLevel.Master,
			},
		});
	} catch (err) {
		return next(new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR));
	}
}

async function serviceAccount(req: Request, res: Response, next: NextFunction) {
	const { id, user } = req.locals;
	let authToken, refreshToken, userService;

	try {
		if (user.userLevel === UserLevel.Agent) {
			return next(new CustomError(AUTH_ERRORS.PERMISSION_DENIED));
		} else if (user.userLevel === UserLevel.Admin) {
			const agent = await AccountDB.findOne({
				parent: user.userId,
				role: UserLevel.Agent,
				_id: id,
			});

			if (!agent) {
				return next(new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR));
			}
		}

		const details = await UserService.loginById(id);
		userService = details.userService;
		authToken = details.authToken;
		refreshToken = details.refreshToken;
	} catch (err) {
		return next(new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR));
	}

	clearCookie(res, Cookie.Auth);
	clearCookie(res, Cookie.Refresh);
	clearCookie(res, Cookie.Device);

	setCookie(res, {
		key: Cookie.Auth,
		value: authToken,
		expires: JWT_EXPIRE_TIME,
	});

	setCookie(res, {
		key: Cookie.Refresh,
		value: refreshToken,
		expires: SESSION_EXPIRE_TIME,
	});

	let devices: {
		id: string;
		phoneNumber: string;
		verifiedName: string;
		phoneNumberId: string;
		waid: string;
	}[] = [];

	if (userService.userLevel >= UserLevel.Admin) {
		devices = await WhatsappLinkService.fetchRecords(userService.userId);
	} else {
		if (userService.account.parent) {
			devices = await WhatsappLinkService.fetchRecords(userService.account.parent!);
		}
	}

	if (devices.length > 0) {
		setCookie(res, {
			key: Cookie.Device,
			value: devices[0].id,
			expires: SESSION_EXPIRE_TIME,
		});
	}

	return Respond({
		res,
		status: 200,
	});
}

async function forgotPassword(req: Request, res: Response, next: NextFunction) {
	const { email, callbackURL } = req.locals.data as ResetPasswordValidationResult;

	try {
		const token = await UserService.generatePasswordResetLink(email);

		const resetLink = `${callbackURL}?code=${token}`;
		const success = await sendPasswordResetEmail(email, resetLink);

		return Respond({
			res,
			status: success ? 200 : 400,
		});
	} catch (err) {
		return next(new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR));
	}
}

async function resetPassword(req: Request, res: Response, next: NextFunction) {
	const user_id = await StorageDB.getString(req.params.id);
	const { password } = req.locals.data as UpdatePasswordValidationResult;

	try {
		if (!user_id) {
			return res.send('Error resetting password');
		}

		await UserService.saveResetPassword(req.params.id, password);

		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function register(req: Request, res: Response, next: NextFunction) {
	const { email, name, phone, password } = req.locals.data as RegisterValidationResult;
	try {
		await UserService.register(email, password, {
			name,
			phone,
			level: UserLevel.Admin,
		});

		const { authToken, refreshToken, userService } = await UserService.login(email, password, {
			platform: req.useragent?.platform || '',
			browser: req.useragent?.browser || '',
		});

		setCookie(res, {
			key: Cookie.Auth,
			value: authToken,
			expires: JWT_EXPIRE_TIME,
		});

		setCookie(res, {
			key: Cookie.Refresh,
			value: refreshToken,
			expires: SESSION_EXPIRE_TIME,
		});

		return Respond({
			res,
			status: 200,
			data: {
				isAdmin: userService.userLevel === UserLevel.Admin,
				isAgent: userService.userLevel === UserLevel.Agent,
				isMaster: userService.userLevel === UserLevel.Master,
			},
		});
	} catch (err) {
		return next(new CustomError(AUTH_ERRORS.USER_ALREADY_EXISTS));
	}
}

async function validateAuth(req: Request, res: Response, next: NextFunction) {
	const { user } = req.locals;
	return Respond({
		res,
		status: 200,
		data: {
			isAdmin: user.userLevel === UserLevel.Admin,
			isAgent: user.userLevel === UserLevel.Agent,
			isMaster: user.userLevel === UserLevel.Master,
		},
	});
}

async function details(req: Request, res: Response, next: NextFunction) {
	const { user } = req.locals;
	const details = await user.getDetails();
	const account = {
		...details,
		walletBalance: details.walletBalance.toFixed(2),
		permissions: {
			auto_assign_chats: true,
			assigned_labels: [] as string[],
			phonebook: {
				create: true,
				update: true,
				delete: true,
				export: true,
			},
			chatbot: {
				create: true,
				update: true,
				delete: true,
				export: true,
			},
			chatbot_flow: {
				create: true,
				update: true,
				delete: true,
				export: true,
			},
			broadcast: {
				create: true,
				update: true,
				report: true,
				export: true,
			},
			recurring: {
				create: true,
				update: true,
				delete: true,
				export: true,
			},
			media: {
				create: true,
				update: true,
				delete: true,
			},
			contacts: {
				create: true,
				update: true,
				delete: true,
			},
			template: {
				create: true,
				update: true,
				delete: true,
			},
			buttons: {
				read: true,
				export: true,
			},
		},
		isAdmin: user.userLevel === UserLevel.Admin,
		isAgent: user.userLevel === UserLevel.Agent,
		isMaster: user.userLevel === UserLevel.Master,
	};

	if (user.userLevel === UserLevel.Agent) {
		account.permissions = await user.getPermissions();
	}

	return Respond({
		res,
		status: 200,
		data: {
			account,
		},
	});
}

async function updateDetails(req: Request, res: Response, next: NextFunction) {
	const { user, data } = req.locals;

	await user.updateDetails(data as UpdateAccountValidationResult);

	return Respond({
		res,
		status: 200,
	});
}

async function logout(req: Request, res: Response, next: NextFunction) {
	try {
		const _refresh_id = req.cookies[Cookie.Refresh];
		const decoded = verify(_refresh_id, REFRESH_SECRET) as JwtPayload;
		UserService.markLogout(decoded.id);
	} catch (err) {
		//ignored
	}
	clearCookie(res, Cookie.Auth);
	clearCookie(res, Cookie.Refresh);
	clearCookie(res, Cookie.Device);
	return Respond({
		res,
		status: 200,
	});
}

const Controller = {
	validateAuth,
	login,
	serviceAccount,
	forgotPassword,
	resetPassword,
	register,
	logout,
	details,
	updateDetails,
};

export default Controller;
