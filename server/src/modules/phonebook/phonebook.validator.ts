import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { z } from 'zod';
import { CustomError } from '../../errors';
import { idsArray } from '../../utils/schema';

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
	labels: string[];
};

export type SetLabelValidationResult = {
	labels: string[];
	ids: Types.ObjectId[];
	numbers: string[];
};

export type MultiDeleteValidationResult = {
	ids: Types.ObjectId[];
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
		labels: string[];
	}[];
};

export type LabelsResult = string[];
export type FieldsResult = {
	name: string;
	defaultValue: string;
};

export async function RecordUpdateValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		salutation: z.string().trim().optional(),
		first_name: z.string().trim().optional(),
		last_name: z.string().trim().optional(),
		middle_name: z.string().trim().optional(),
		phone_number: z
			.string()
			.trim()
			.transform((val) => val.replace(/\D/g, ''))
			.optional(),
		email: z.string().trim().optional(),
		birthday: z.string().trim().optional(),
		anniversary: z.string().trim().optional(),
		others: z.record(z.string().trim(), z.string().trim()).default({}),
		labels: z.string().trim().array().default([]),
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

export async function LabelValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z
		.object({
			ids: idsArray.default([]),
			numbers: z.string().trim().array().default([]),
			labels: z.string().trim().array().default([]),
		})
		.refine(
			(data) => data.ids.length || data.numbers.length,
			'At least one of ids or numbers is required'
		);

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

export async function MultiDeleteValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		ids: idsArray.default([]),
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

export async function RecordsValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		records: z
			.object({
				salutation: z.string().trim().optional(),
				first_name: z.string().trim().optional(),
				last_name: z.string().trim().optional(),
				middle_name: z.string().trim().optional(),
				phone_number: z.string().trim().optional(),
				email: z.string().trim().optional(),
				birthday: z.string().trim().optional(),
				anniversary: z.string().trim().optional(),
				others: z.record(z.string().trim(), z.string().trim()).default({}),
				labels: z.string().trim().array().default([]),
			})
			.array()
			.default([]),
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

export async function FieldsValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		name: z.string().trim(),
		defaultValue: z.string().trim().default(''),
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
