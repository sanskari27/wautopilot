import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { CustomError } from '../../errors';

export type SingleRecordValidationResult = {
	salutation?: string;
	first_name?: string;
	last_name?: string;
	middle_name?: string;
	phone_number?: string;
	email?: string;
	birthday?: string;
	anniversary?: string;

	others: {
		[others: string]: string;
	};
};

export type RecordsValidationResult = {
	records: {
		salutation?: string;
		first_name?: string;
		last_name?: string;
		middle_name?: string;
		phone_number?: string;
		email?: string;
		birthday?: string;
		anniversary?: string;

		others: {
			[others: string]: string;
		};
	}[];
};

export type LabelsResult = string[];

export async function RecordUpdateValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		salutation: z.string().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		middle_name: z.string().optional(),
		phone_number: z.string().optional(),
		email: z.string().email().optional(),
		birthday: z.string().optional(),
		anniversary: z.string().optional(),
		others: z.object({}).default({}),
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

export async function LabelValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		labels: z.string().array().default([]),
	});

	const reqValidatorResult = reqValidator.safeParse(req.body);

	if (reqValidatorResult.success) {
		req.locals.data = reqValidatorResult.data.labels;
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
				email: z.string().email().optional(),
				birthday: z.string().optional(),
				anniversary: z.string().optional(),
				others: z.object({}).default({}),
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
