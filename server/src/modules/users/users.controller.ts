import { NextFunction, Request, Response } from 'express';
import { UserLevel } from '../../config/const';
import { AUTH_ERRORS, CustomError } from '../../errors';
import COMMON_ERRORS from '../../errors/common-errors';
import { UserService } from '../../services';
import { Respond } from '../../utils/ExpressUtils';
import {
	CreateAgentValidationResult,
	PermissionsValidationResult,
	UpgradePlanValidationResult,
} from './users.validator';
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
	const rate = Number(req.body.rate) as number;

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

async function createAgent(req: Request, res: Response, next: NextFunction) {
	const { email, name, phone, password } = req.locals.data as CreateAgentValidationResult;
	try {
		if (req.locals.user.userLevel < UserLevel.Admin) {
			return next(new CustomError(AUTH_ERRORS.PERMISSION_DENIED));
		}
		const id = await UserService.register(email, password, {
			name,
			phone,
			level: UserLevel.Agent,
			linked_to: req.locals.user.userId,
		});

		return Respond({
			res,
			status: 200,
			data: {
				id,
				email,
				name,
				phone,
			},
		});
	} catch (err) {
		return next(new CustomError(AUTH_ERRORS.USER_ALREADY_EXISTS));
	}
}

async function updateAgent(req: Request, res: Response, next: NextFunction) {
	const { email, name, phone } = req.locals.data as CreateAgentValidationResult;
	const { id, user } = req.locals;
	try {
		const details = await user.updateAgentDetails(id, {
			email,
			name,
			phone,
		});

		return Respond({
			res,
			status: 200,
			data: {
				...details,
			},
		});
	} catch (err) {
		return next(new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR));
	}
}

async function assignPermissions(req: Request, res: Response, next: NextFunction) {
	const data = req.locals.data as PermissionsValidationResult;
	const { id, user } = req.locals;
	try {
		const details = await user.assignPermissions(id, data);

		return Respond({
			res,
			status: 200,
			data: {
				...details,
			},
		});
	} catch (err) {
		return next(new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR));
	}
}

async function getAgents(req: Request, res: Response, next: NextFunction) {
	try {
		return Respond({
			res,
			status: 200,
			data: {
				list: await req.locals.serviceUser.getAgents(),
			},
		});
	} catch (err) {
		return next(new CustomError(AUTH_ERRORS.PERMISSION_DENIED));
	}
}

async function removeAgent(req: Request, res: Response, next: NextFunction) {
	const { id, user } = req.locals;
	user.removeAgent(id);

	return Respond({
		res,
		status: 200,
	});
}

const Controller = {
	getAdmins,
	extendSubscription,
	upgradePlan,
	setMarkupPrice,
	getAgents,
	createAgent,
	updateAgent,
	assignPermissions,
	removeAgent,
};

export default Controller;
