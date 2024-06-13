import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { z } from 'zod';
import { CustomError } from '../../errors';

export async function AddAmountValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		amount: z.number().int().positive(),
	});

	const reqValidatorResult = reqValidator.safeParse(req.body);

	if (reqValidatorResult.success) {
		req.locals.data = reqValidatorResult.data.amount;
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

export async function LabelValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		ids: z
			.string()
			.array()
			.default([])
			.refine((ids) => !ids.some((value) => !Types.ObjectId.isValid(value)))
			.transform((ids) => ids.map((value) => new Types.ObjectId(value))),
		labels: z.string().array().default([]),
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

export async function MultiDeleteValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		ids: z
			.string()
			.array()
			.default([])
			.refine((ids) => !ids.some((value) => !Types.ObjectId.isValid(value)))
			.transform((ids) => ids.map((value) => new Types.ObjectId(value))),
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

export async function RecordsValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		records: z
			.object({
				salutation: z.string().optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				middle_name: z.string().optional(),
				phone_number: z.string().optional(),
				email: z.string().optional(),
				birthday: z.string().optional(),
				anniversary: z.string().optional(),
				others: z.record(z.string(), z.string()).default({}),
				labels: z.string().array().default([]),
			})
			.array()
			.default([]),
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
