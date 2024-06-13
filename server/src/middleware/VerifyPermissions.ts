import { NextFunction, Request, Response } from 'express';
import { PlanDB } from '../../mongo';
import { Permissions } from '../config/const';
import { CustomError } from '../errors';
import COMMON_ERRORS from '../errors/common-errors';
import DateUtils from '../utils/DateUtils';

export default function VerifyPermissions(permission: Permissions) {
	async function validator(req: Request, res: Response, next: NextFunction) {
		const { account } = req.locals;
		const isSubscribed =
			account.subscription &&
			DateUtils.getMoment(account.subscription.end_date).isAfter(DateUtils.getMomentNow());

		if (!isSubscribed) {
			return next(new CustomError(COMMON_ERRORS.PERMISSION_DENIED));
		}

		const plan = await PlanDB.findById(account.subscription!.plan_id);

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
