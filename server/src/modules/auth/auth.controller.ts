import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { Cookie, REFRESH_SECRET } from '../../config/const';
import { AUTH_ERRORS, CustomError } from '../../errors';
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
	const { email, password, accessLevel, latitude, longitude } = req.locals
		.data as LoginValidationResult;

	try {
		const { authToken, refreshToken } = await UserService.login(email, password, {
			level: accessLevel,
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
			expires: JWT_EXPIRE_TIME,
		});

		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		return next(new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR));
	}
}

async function resetPassword(req: Request, res: Response, next: NextFunction) {
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

async function updatePassword(req: Request, res: Response, next: NextFunction) {
	const { password, token: update_token } = req.locals.data as UpdatePasswordValidationResult;

	try {
		const { authToken, refreshToken } = await UserService.saveResetPassword(update_token, password);

		setCookie(res, {
			key: Cookie.Auth,
			value: authToken,
			expires: JWT_EXPIRE_TIME,
		});

		setCookie(res, {
			key: Cookie.Refresh,
			value: refreshToken,
			expires: JWT_EXPIRE_TIME,
		});

		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		return next(new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR));
	}
}

async function register(req: Request, res: Response, next: NextFunction) {
	const { email, name, phone, latitude, longitude, accessLevel } = req.locals
		.data as RegisterValidationResult;
	try {
		const { authToken, refreshToken } = await UserService.register(email, {
			name,
			phone,
			level: accessLevel,
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
			expires: JWT_EXPIRE_TIME,
		});
		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		return next(new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR));
	}
}

async function validateAuth(req: Request, res: Response, next: NextFunction) {
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
	resetPassword,
	updatePassword,
	register,
	logout,
};

export default Controller;
