import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { z } from 'zod';
import { CustomError } from '../../errors';

export type CreateContactValidationResult = {
	addresses: {
		type: string;
		street: string;
		city: string;
		state: string;
		zip: string;
		country: string;
		country_code: string;
	}[];
	birthday: string;
	emails: {
		email: string;
		type: string;
	}[];
	name: {
		formatted_name: string;
		first_name: string;
		last_name: string;
		middle_name: string;
		suffix: string;
		prefix: string;
	};
	org: {
		company: string;
		department: string;
		title: string;
	};
	phones: {
		phone: string;
		wa_id: string;
		type: string;
	}[];
	urls: {
		url: string;
		type: string;
	}[];
};

export type MultiDeleteValidationResult = {
	ids: Types.ObjectId[];
};

export function CreateContactValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		address: z
			.object({
				type: z.string().default(''),
				street: z.string().default(''),
				city: z.string().default(''),
				state: z.string().default(''),
				zip: z.string().default(''),
				country: z.string().default(''),
				country_code: z.string().default(''),
			})
			.array()
			.default([]),
		birthday: z.string().default(''),
		emails: z
			.object({
				email: z.string().default(''),
				type: z.string().default(''),
			})
			.array()
			.default([]),

		name: z.object({
			formatted_name: z.string().default(''),
			first_name: z.string().default(''),
			last_name: z.string().default(''),
			middle_name: z.string().default(''),
			suffix: z.string().default(''),
			prefix: z.string().default(''),
		}),
		org: z.object({
			company: z.string().default(''),
			department: z.string().default(''),
			title: z.string().default(''),
		}),
		phones: z
			.object({
				phone: z.string().default(''),
				wa_id: z.string().default(''),
				type: z.string().default(''),
			})
			.array()
			.default([]),
		urls: z
			.object({
				url: z.string().default(''),
				type: z.string().default(''),
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
