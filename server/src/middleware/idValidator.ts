import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { CustomError } from '../errors';
import { idValidator } from '../utils/ExpressUtils';
import { idsArray } from '../utils/schema';

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

export async function IDsValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		ids: idsArray,
	});

	const reqValidatorResult = reqValidator.safeParse(req.body);

	if (reqValidatorResult.success) {
		req.locals.data = reqValidatorResult.data.ids;
		return next();
	}
	const message = reqValidatorResult.error.issues
		.map((err) => err.path)
		.flat()
		.filter((item, pos, arr) => arr.indexOf(item) == pos)
		.join(', ');

	return next(new CustomError({ STATUS: 400, TITLE: 'INVALID_FIELDS', MESSAGE: message }));
}
