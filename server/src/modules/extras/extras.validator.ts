import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { CustomError } from '../../errors';

export type FAQValidationResult = {
	title: string;
	info: string;
}[];

export type TestimonialsValidationResult = {
	title: string;
	name: string;
	photo_url: string;
	description: string;
}[];

export async function FAQValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		list: z
			.object({
				title: z.string().trim(),
				info: z.string().trim(),
			})
			.array(),
	});

	const reqValidatorResult = reqValidator.safeParse(req.body);

	if (reqValidatorResult.success) {
		req.locals.data = reqValidatorResult.data.list;
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

export async function TestimonialValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		list: z
			.object({
				name: z.string().trim(),
				photo_url: z.string().trim(),
				title: z.string().trim(),
				description: z.string().trim(),
			})
			.array(),
	});

	const reqValidatorResult = reqValidator.safeParse(req.body);

	if (reqValidatorResult.success) {
		req.locals.data = reqValidatorResult.data.list;
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
