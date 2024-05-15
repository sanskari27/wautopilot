import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import {
	COOKIE_DOMAIN_VALUE,
	Cookie,
	IS_PRODUCTION,
	REFRESH_SECRET,
	UserLevel,
} from '../../config/const';
import { AUTH_ERRORS, CustomError } from '../../errors';
import { sendPasswordResetEmail, sendWelcomeEmail } from '../../provider/email';
import { SessionService } from '../../services';
import { Respond } from '../../utils/ExpressUtils';
import {
	LoginValidationResult,
	ResetPasswordValidationResult,
	UpdatePasswordValidationResult,
} from './session.validator';
export const JWT_EXPIRE_TIME = 3 * 60 * 1000;
export const SESSION_EXPIRE_TIME = 28 * 24 * 60 * 60 * 1000;

async function login(req: Request, res: Response, next: NextFunction) {
	const { email, password, type, latitude, longitude } = req.locals.data as LoginValidationResult;

	try {
		const [{ authToken, refreshToken }] = await SessionService.login(email, password, {
			level: type === 'admin' ? UserLevel.Admin : UserLevel.User,
			latitude: latitude ?? 0,
			longitude: longitude ?? 0,
			platform: req.useragent?.platform || '',
			browser: req.useragent?.browser || '',
		});
		res.cookie(Cookie.Auth, authToken, {
			sameSite: 'strict',
			expires: new Date(Date.now() + JWT_EXPIRE_TIME),
			httpOnly: IS_PRODUCTION,
			secure: IS_PRODUCTION,
			domain: IS_PRODUCTION ? COOKIE_DOMAIN_VALUE : 'localhost',
		});
		res.cookie(Cookie.Refresh, refreshToken, {
			sameSite: 'strict',
			expires: new Date(Date.now() + JWT_EXPIRE_TIME),
			httpOnly: IS_PRODUCTION,
			secure: IS_PRODUCTION,
			domain: IS_PRODUCTION ? COOKIE_DOMAIN_VALUE : 'localhost',
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
		const token = await SessionService.generatePasswordResetLink(email);

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
		const [{ authToken, refreshToken }] = await SessionService.saveResetPassword(
			update_token,
			password
		);

		res.cookie(Cookie.Auth, authToken, {
			sameSite: 'strict',
			expires: new Date(Date.now() + JWT_EXPIRE_TIME),
			httpOnly: IS_PRODUCTION,
			secure: IS_PRODUCTION,
			domain: IS_PRODUCTION ? COOKIE_DOMAIN_VALUE : 'localhost',
		});

		res.cookie(Cookie.Refresh, refreshToken, {
			sameSite: 'strict',
			expires: new Date(Date.now() + JWT_EXPIRE_TIME),
			httpOnly: IS_PRODUCTION,
			secure: IS_PRODUCTION,
			domain: IS_PRODUCTION ? COOKIE_DOMAIN_VALUE : 'localhost',
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
	const { email, password, latitude, longitude, type } = req.locals.data as LoginValidationResult;
	try {
		const [{ authToken, refreshToken }] = await SessionService.register(email, password, {
			level: type === 'admin' ? UserLevel.Admin : UserLevel.User,
			latitude: latitude ?? 0,
			longitude: longitude ?? 0,
			platform: req.useragent?.platform || '',
			browser: req.useragent?.browser || '',
		});
		sendWelcomeEmail(email);

		res.cookie(Cookie.Auth, authToken, {
			sameSite: 'strict',
			expires: new Date(Date.now() + JWT_EXPIRE_TIME),
			httpOnly: IS_PRODUCTION,
			secure: IS_PRODUCTION,
			domain: IS_PRODUCTION ? COOKIE_DOMAIN_VALUE : 'localhost',
		});

		res.cookie(Cookie.Refresh, refreshToken, {
			sameSite: 'strict',
			expires: new Date(Date.now() + JWT_EXPIRE_TIME),
			httpOnly: IS_PRODUCTION,
			secure: IS_PRODUCTION,
			domain: IS_PRODUCTION ? COOKIE_DOMAIN_VALUE : 'localhost',
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
		SessionService.markLogout(decoded.id);
	} catch (err) {
		//ignored
	}
	res.clearCookie(Cookie.Auth, {
		sameSite: 'strict',
		httpOnly: IS_PRODUCTION,
		secure: IS_PRODUCTION,
		domain: IS_PRODUCTION ? COOKIE_DOMAIN_VALUE : 'localhost',
	});
	res.clearCookie(Cookie.Refresh, {
		sameSite: 'strict',
		httpOnly: IS_PRODUCTION,
		secure: IS_PRODUCTION,
		domain: IS_PRODUCTION ? COOKIE_DOMAIN_VALUE : 'localhost',
	});
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
