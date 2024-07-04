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
				title: z.string(),
				info: z.string(),
			})
			.array(),
	});

	const reqValidatorResult = reqValidator.safeParse(req.body);

	if (reqValidatorResult.success) {
		req.locals.data = reqValidatorResult.data.list;
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

export async function TestimonialValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		list: z
			.object({
				name: z.string(),
				photo_url: z.string(),
				title: z.string(),
				description: z.string(),
			})
			.array(),
	});

	const reqValidatorResult = reqValidator.safeParse(req.body);

	if (reqValidatorResult.success) {
		req.locals.data = reqValidatorResult.data.list;
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
