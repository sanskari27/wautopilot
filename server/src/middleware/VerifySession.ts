import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import {
	Cookie,
	JWT_SECRET,
	REFRESH_SECRET,
	SESSION_EXPIRE_TIME,
	UserLevel,
} from '../config/const';
import { CustomError } from '../errors';
import AUTH_ERRORS from '../errors/auth-errors';
import { SessionService, UserService } from '../services';
import AgentLogService from '../services/agentLogs';
import { setCookie } from '../utils/ExpressUtils';

export default async function VerifySession(req: Request, res: Response, next: NextFunction) {
	const _auth_id = req.cookies[Cookie.Auth];

	if (_auth_id) {
		try {
			const decoded = verify(_auth_id, JWT_SECRET) as JwtPayload;
			const session = await SessionService.findSessionById(decoded.id);

			req.locals.user = await UserService.findById(session.userId);
			if (req.locals.user.userLevel >= UserLevel.Admin) {
				req.locals.serviceUser = req.locals.user;
				req.locals.serviceAccount = req.locals.serviceUser.account;
			} else if (req.locals.user.userLevel === UserLevel.Agent) {
				const parent = req.locals.user.account.parent;
				req.locals.serviceUser = await UserService.findById(parent!);
				const serviceAccount = (req.locals.serviceAccount = req.locals.serviceUser.account);
				req.locals.agentLogService = new AgentLogService(serviceAccount, req.locals.user.account);
			}

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
			if (req.locals.user.userLevel >= UserLevel.Admin) {
				req.locals.serviceUser = req.locals.user;
				req.locals.serviceAccount = req.locals.serviceUser.account;
			} else if (req.locals.user.userLevel === UserLevel.Agent) {
				const parent = req.locals.user.account.parent;
				req.locals.serviceUser = await UserService.findById(parent!);
				const serviceAccount = req.locals.serviceAccount = req.locals.serviceUser.account;
				req.locals.agentLogService = new AgentLogService(serviceAccount, req.locals.user.account);
			}

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

		return next(new CustomError(AUTH_ERRORS.PERMISSION_DENIED));
	}
	return validator;
}
