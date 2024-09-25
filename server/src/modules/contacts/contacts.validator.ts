import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { z } from 'zod';
import { CustomError } from '../../errors';
import { idsArray } from '../../utils/schema';

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
				type: z.string().trim().default(''),
				street: z.string().trim().default(''),
				city: z.string().trim().default(''),
				state: z.string().trim().default(''),
				zip: z.string().trim().default(''),
				country: z.string().trim().default(''),
				country_code: z.string().trim().default(''),
			})
			.array()
			.default([]),
		birthday: z.string().trim().default(''),
		emails: z
			.object({
				email: z.string().trim().default(''),
				type: z.string().trim().default('HOME'),
			})
			.array()
			.default([]),

		name: z.object({
			formatted_name: z.string().trim().default(''),
			first_name: z.string().trim().default(''),
			last_name: z.string().trim().default(''),
			middle_name: z.string().trim().default(''),
			suffix: z.string().trim().default(''),
			prefix: z.string().trim().default(''),
		}),
		org: z.object({
			company: z.string().trim().default(''),
			department: z.string().trim().default(''),
			title: z.string().trim().default(''),
		}),
		phones: z
			.object({
				phone: z.string().trim().default(''),
				wa_id: z.string().trim().default(''),
				type: z.string().trim().default('HOME'),
			})
			.array()
			.default([]),
		urls: z
			.object({
				url: z.string().trim().default(''),
				type: z.string().trim().default('HOME'),
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
