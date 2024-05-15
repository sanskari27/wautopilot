import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import {
	COOKIE_DOMAIN_VALUE,
	Cookie,
	IS_PRODUCTION,
	JWT_SECRET,
	REFRESH_SECRET,
	SESSION_EXPIRE_TIME,
} from '../config/const';
import { CustomError } from '../errors';
import AUTH_ERRORS from '../errors/auth-errors';
import SessionService from '../services/session';

export default async function VerifySession(req: Request, res: Response, next: NextFunction) {
	const _auth_id = req.cookies[Cookie.Auth];

	if (_auth_id) {
		try {
			const decoded = verify(_auth_id, JWT_SECRET) as JwtPayload;
			req.locals.user = await SessionService.findAccountById(decoded.id);

			if (req.locals.user) {
				res.cookie(Cookie.Auth, req.locals.user.id, {
					sameSite: 'none',
					expires: new Date(Date.now() + SESSION_EXPIRE_TIME),
					httpOnly: IS_PRODUCTION,
					secure: IS_PRODUCTION,
					domain: IS_PRODUCTION ? COOKIE_DOMAIN_VALUE : 'localhost',
				});
				return next();
			}
		} catch (err) {
			//ignored
		}
	}

	const _refresh_id = req.cookies[Cookie.Refresh];

	if (_refresh_id) {
		try {
			const decoded = verify(_refresh_id, REFRESH_SECRET) as JwtPayload;
			req.locals.user = await SessionService.findAccountByRefreshToken(decoded.id);
		} catch (err) {
			//ignored
		}
	}

	return next(new CustomError(AUTH_ERRORS.SESSION_INVALIDATED));
}
export function VerifyMinLevel(level: number) {
	function validator(req: Request, res: Response, next: NextFunction) {
		if (req.locals.user && req.locals.user.level >= level) {
			return next();
		}

		return next(new CustomError(AUTH_ERRORS.SESSION_INVALIDATED));
	}
	return validator;
}
