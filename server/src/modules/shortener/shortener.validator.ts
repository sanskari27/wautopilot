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
			title: z.string().default(''),
			type: z.enum(['whatsapp', 'link']),
			link: z.string().optional(),
			number: z.string().optional(),
			message: z.string().optional(),
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
