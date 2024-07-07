import { NextFunction, Request, Response } from 'express';
import { UserLevel } from '../config/const';
import { CustomError } from '../errors';
import COMMON_ERRORS from '../errors/common-errors';

export default function VerifyPermissions(permission: string) {
	async function validator(req: Request, res: Response, next: NextFunction) {
		const { user } = req.locals;
		if (user.userLevel >= UserLevel.Admin) {
			return next();
		}
		if (user.userLevel === UserLevel.Agent) {
			const permissions = (await user.getPermissions()) as any;
			const [module, action] = permission.split('.');
			if (!permissions[module] || !permissions[module][action]) {
				return next(new CustomError(COMMON_ERRORS.PERMISSION_DENIED));
			}
		}
		return next();
	}
	return validator;
}
