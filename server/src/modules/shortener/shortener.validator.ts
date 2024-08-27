import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { CustomError } from '../../errors';

export type CreateLinkValidationResult = {
	title: string;
	type: 'whatsapp' | 'link';
	number?: string | undefined;
	message?: string | undefined;
	link?: string | undefined;
};

export async function LinkValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z
		.object({
			title: z.string().trim().default(''),
			type: z.enum(['whatsapp', 'link']),
			link: z.string().trim().optional(),
			number: z.string().trim().optional(),
			message: z.string().trim().optional(),
		})
		.refine((data) => {
			if (data.type === 'whatsapp') {
				return data.number && data.message;
			}
			return !!data.link;
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
