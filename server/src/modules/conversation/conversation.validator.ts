import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { z } from 'zod';
import { CustomError } from '../../errors';
import { idsArray } from '../../utils/schema';

export type SendMessageValidationResult = {
	type: 'text' | 'image' | 'video' | 'document' | 'audio' | 'location' | 'contacts';
	media_id?: string | undefined;
	text?: string | undefined;
	location?:
		| {
				name: string;
				latitude: string;
				longitude: string;
				address: string;
		  }
		| undefined;
	contacts: {
		name: {
			formatted_name: string;
			first_name: string;
			last_name: string;
			middle_name: string;
			suffix: string;
			prefix: string;
		};
		addresses: {
			type: 'HOME' | 'WORK';
			street: string;
			city: string;
			state: string;
			zip: string;
			country: string;
			country_code: string;
		}[];
		birthday: string;
		emails: {
			type: 'HOME' | 'WORK';
			email: string;
		}[];
		org: {
			company: string;
			department: string;
			title: string;
		};
		phones: {
			type: 'HOME' | 'WORK';
			phone: string;
			wa_id: string;
		}[];
		urls: {
			type: 'HOME' | 'WORK';
			url: string;
		}[];
	}[];
	context: {
		message_id: string;
	};
};

export type NumbersValidationResult = {
	numbers: string[];
	phonebook_ids: Types.ObjectId[];
};

export async function SendMessageValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		type: z.enum(['text', 'image', 'video', 'document', 'audio', 'location', 'contacts']),
		text: z.string().trim().optional(),
		media_id: z.string().trim().optional(),
		location: z
			.object({
				latitude: z.string().trim(),
				longitude: z.string().trim(),
				name: z.string().trim(),
				address: z.string().trim(),
			})
			.optional(),

		contacts: z
			.object({
				name: z.object({
					formatted_name: z.string().trim(),
					first_name: z.string().trim(),
					last_name: z.string().trim(),
					middle_name: z.string().trim(),
					suffix: z.string().trim(),
					prefix: z.string().trim(),
				}),
				addresses: z.array(
					z.object({
						street: z.string().trim(),
						city: z.string().trim(),
						state: z.string().trim(),
						zip: z.string().trim(),
						country: z.string().trim(),
						country_code: z.string().trim(),
						type: z.enum(['HOME', 'WORK']).default('HOME'),
					})
				),
				birthday: z.string().trim(),
				emails: z.array(
					z.object({
						email: z.string().trim(),
						type: z.enum(['WORK', 'HOME']).default('HOME'),
					})
				),
				org: z.object({
					company: z.string().trim(),
					department: z.string().trim(),
					title: z.string().trim(),
				}),
				phones: z.array(
					z.object({
						phone: z.string().trim(),
						wa_id: z.string().trim(),
						type: z.enum(['HOME', 'WORK']).default('HOME'),
					})
				),
				urls: z.array(
					z.object({
						url: z.string().trim(),
						type: z.enum(['HOME', 'WORK']).default('HOME'),
					})
				),
			})
			.array()
			.optional(),
		context: z
			.object({
				message_id: z.string().trim(),
			})
			.optional(),
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
	const reqValidator = z.object({
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

export async function NumbersValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z
		.object({
			numbers: z.string().trim().array().default([]),
			phonebook_ids: idsArray.default([]),
		})
		.refine((data) => {
			if (data.numbers.length === 0 && data.phonebook_ids.length === 0) {
				return false;
			} else if (data.numbers.length > 0 && data.phonebook_ids.length > 0) {
				return false;
			}
			return true;
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
