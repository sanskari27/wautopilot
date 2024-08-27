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
		phoneNumberId: z.string().trim(),
		waid: z.string().trim(),
		accessToken: z.string().trim().optional(),
		code: z.string().trim().optional(),
	});

	const reqValidatorResult = reqValidator.safeParse(req.body);

	if (reqValidatorResult.success) {
		req.locals.data = reqValidatorResult.data;
		return next();
	}

	return next(
		new CustomError({
			STATUS: 400,
			TITLE: 'INVALID_FIELDS',
			MESSAGE: "Invalid fields in the request's body.",
			OBJECT: reqValidatorResult.error.flatten(),
		})
	);
}
