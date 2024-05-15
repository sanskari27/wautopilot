import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../errors';
import { idValidator } from '../utils/ExpressUtils';

export default async function IDValidator(req: Request, res: Response, next: NextFunction) {
	const [validationResult, validationResult_data] = idValidator(req.params.id);
	if (validationResult) {
		req.locals.id = validationResult_data;
		return next();
	}

	return next(
		new CustomError({
			STATUS: 400,
			TITLE: 'INVALID_FIELDS',
			MESSAGE: 'Invalid ID',
		})
	);
}
