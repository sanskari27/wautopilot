import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../../errors';
import COMMON_ERRORS from '../../errors/common-errors';
import { Respond } from '../../utils/ExpressUtils';
export const JWT_EXPIRE_TIME = 3 * 60 * 1000;
export const SESSION_EXPIRE_TIME = 28 * 24 * 60 * 60 * 1000;

async function getAdmins(req: Request, res: Response, next: NextFunction) {
	try {
		const users = await req.locals.user.getUsers();
		return Respond({
			res,
			status: 200,
			data: { users },
		});
	} catch (err) {
		if (err instanceof CustomError) return next(err);
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR));
	}
}

const Controller = {
	getAdmins,
};

export default Controller;
