import { NextFunction, Request, Response } from 'express';
import { PlanDB } from '../../mongo';
import { Permissions } from '../config/const';
import { CustomError } from '../errors';
import COMMON_ERRORS from '../errors/common-errors';

export default function VerifyPermissions(permission: Permissions) {
	async function validator(req: Request, res: Response, next: NextFunction) {
		const { user } = req.locals;
		const details = await user.getDetails();

		if (!details.isSubscribed) {
			return next(new CustomError(COMMON_ERRORS.PERMISSION_DENIED));
		}

		const plan = await PlanDB.findById(details.plan_id);

		if (!plan) {
			return next(new CustomError(COMMON_ERRORS.PERMISSION_DENIED));
		}
		if (plan.features[permission]) {
			req.locals.plan = plan;
			return next();
		}
		return next(new CustomError(COMMON_ERRORS.PERMISSION_DENIED));
	}
	return validator;
}
