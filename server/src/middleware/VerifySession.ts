import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { Cookie, JWT_SECRET, REFRESH_SECRET, SESSION_EXPIRE_TIME } from '../config/const';
import { CustomError } from '../errors';
import AUTH_ERRORS from '../errors/auth-errors';
import { SessionService, UserService } from '../services';
import { setCookie } from '../utils/ExpressUtils';

export default async function VerifySession(req: Request, res: Response, next: NextFunction) {
	const _auth_id = req.cookies[Cookie.Auth];

	if (_auth_id) {
		try {
			const decoded = verify(_auth_id, JWT_SECRET) as JwtPayload;
			const session = await SessionService.findSessionById(decoded.id);

			req.locals.user = await UserService.findById(session.userId);

			setCookie(res, {
				key: Cookie.Auth,
				value: session.authToken,
				expires: SESSION_EXPIRE_TIME,
			});
			return next();
		} catch (err) {
			//ignored
		}
	}

	const _refresh_id = req.cookies[Cookie.Refresh];

	if (_refresh_id) {
		try {
			const decoded = verify(_refresh_id, REFRESH_SECRET) as JwtPayload;
			const session = await SessionService.findSessionByRefreshToken(decoded.id);

			req.locals.user = await UserService.findById(session.userId);

			setCookie(res, {
				key: Cookie.Auth,
				value: session.authToken,
				expires: SESSION_EXPIRE_TIME,
			});
			return next();
		} catch (err) {
			//ignored
		}
	}

	return next(new CustomError(AUTH_ERRORS.SESSION_INVALIDATED));
}

export function VerifyMinLevel(level: number) {
	function validator(req: Request, res: Response, next: NextFunction) {
		if (req.locals.user && req.locals.user.userLevel >= level) {
			return next();
		}

		return next(new CustomError(AUTH_ERRORS.SESSION_INVALIDATED));
	}
	return validator;
}
