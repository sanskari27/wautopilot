import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { AccountDB, StorageDB } from '../../../mongo';
import { Cookie, REFRESH_SECRET, UserLevel } from '../../config/const';
import { AUTH_ERRORS, CustomError } from '../../errors';
import COMMON_ERRORS from '../../errors/common-errors';
import { sendPasswordResetEmail } from '../../provider/email';
import { UserService } from '../../services';
import { Respond, setCookie } from '../../utils/ExpressUtils';
import {
	LoginValidationResult,
	RegisterValidationResult,
	ResetPasswordValidationResult,
	UpdatePasswordValidationResult,
} from './auth.validator';
export const JWT_EXPIRE_TIME = 3 * 60 * 1000;
export const SESSION_EXPIRE_TIME = 28 * 24 * 60 * 60 * 1000;

async function login(req: Request, res: Response, next: NextFunction) {
	const { email, password, latitude, longitude } = req.locals.data as LoginValidationResult;

	try {
		const { authToken, refreshToken } = await UserService.login(email, password, {
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

		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		return next(new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR));
	}
}

async function serviceAccount(req: Request, res: Response, next: NextFunction) {
	const { id, user } = req.locals;
	let authToken: string, refreshToken: string;

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

		const { authToken: a, refreshToken: r } = await UserService.loginById(id);
		authToken = a;
		refreshToken = r;
	} catch (err) {
		return next(new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR));
	}

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

		const { authToken, refreshToken } = await UserService.login(email, password, {
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
		});
	} catch (err) {
		return next(new CustomError(AUTH_ERRORS.USER_ALREADY_EXISTS));
	}
}

async function validateAuth(req: Request, res: Response, next: NextFunction) {
	return Respond({
		res,
		status: 200,
	});
}

async function details(req: Request, res: Response, next: NextFunction) {
	const { user } = req.locals;
	const details = await user.getDetails();
	const account = {
		...details,
		walletBalance: details.walletBalance.toFixed(2),
		permissions: {
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

async function logout(req: Request, res: Response, next: NextFunction) {
	try {
		const _refresh_id = req.cookies[Cookie.Refresh];
		const decoded = verify(_refresh_id, REFRESH_SECRET) as JwtPayload;
		UserService.markLogout(decoded.id);
	} catch (err) {
		//ignored
	}
	res.clearCookie(Cookie.Auth);
	res.clearCookie(Cookie.Refresh);
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
};

export default Controller;
