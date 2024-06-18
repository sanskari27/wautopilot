import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../../errors';
import COMMON_ERRORS from '../../errors/common-errors';
import { UserService } from '../../services';
import { Respond } from '../../utils/ExpressUtils';
import { UpgradePlanValidationResult } from './users.validator';
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

async function extendSubscription(req: Request, res: Response, next: NextFunction) {
	if (!req.body.date || typeof req.body.date !== 'string') {
		return next(new CustomError(COMMON_ERRORS.INVALID_FIELDS));
	}

	try {
		const userService = await UserService.findById(req.locals.id);
		await userService.extendSubscription(req.body.date as string);
		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		if (err instanceof CustomError) return next(err);
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR));
	}
}

async function upgradePlan(req: Request, res: Response, next: NextFunction) {
	const { date, plan_id } = req.locals.data as UpgradePlanValidationResult;

	try {
		const userService = await UserService.findById(req.locals.id);
		if (plan_id) {
			await userService.upgradePlan(plan_id, date);
		} else {
			await userService.removePlan();
		}
		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		if (err instanceof CustomError) return next(err);
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR));
	}
}

async function setMarkupPrice(req: Request, res: Response, next: NextFunction) {
	const rate = req.body.rate as number;

	try {
		const userService = await UserService.findById(req.locals.id);
		await userService.setMarkupPrice(rate);
		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		if (err instanceof CustomError) return next(err);
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR));
	}
}

const Controller = {
	getAdmins,
	extendSubscription,
	upgradePlan,
	setMarkupPrice,
};

export default Controller;
