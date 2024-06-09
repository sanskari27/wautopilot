import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { CustomError } from '../../errors';

export type WhatsappLinkCreateValidationResult = {
	phoneNumberId: string;
	waid: string;
	accessToken?: string;
	code?: string;
};

export async function WhatsappLinkCreateValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		phoneNumberId: z.string(),
		waid: z.string(),
		accessToken: z.string().optional(),
		code: z.string().optional(),
	});

	const reqValidatorResult = reqValidator.safeParse(req.body);

	if (reqValidatorResult.success) {
		req.locals.data = reqValidatorResult.data;
		return next();
	}
	const message = reqValidatorResult.error.issues
		.map((err) => err.path)
		.flat()
		.filter((item, pos, arr) => arr.indexOf(item) == pos)
		.join(', ');

	return next(
		new CustomError({
			STATUS: 400,
			TITLE: 'INVALID_FIELDS',
			MESSAGE: message,
		})
	);
}
