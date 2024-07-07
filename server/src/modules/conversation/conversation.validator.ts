import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { z } from 'zod';
import { CustomError } from '../../errors';

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
		text: z.string().optional(),
		media_id: z.string().optional(),
		location: z
			.object({
				latitude: z.string(),
				longitude: z.string(),
				name: z.string(),
				address: z.string(),
			})
			.optional(),

		contacts: z
			.object({
				name: z.object({
					formatted_name: z.string(),
					first_name: z.string(),
					last_name: z.string(),
					middle_name: z.string(),
					suffix: z.string(),
					prefix: z.string(),
				}),
				addresses: z.array(
					z.object({
						street: z.string(),
						city: z.string(),
						state: z.string(),
						zip: z.string(),
						country: z.string(),
						country_code: z.string(),
						type: z.enum(['HOME', 'WORK']).default('HOME'),
					})
				),
				birthday: z.string(),
				emails: z.array(
					z.object({
						email: z.string(),
						type: z.enum(['WORK', 'HOME']).default('HOME'),
					})
				),
				org: z.object({
					company: z.string(),
					department: z.string(),
					title: z.string(),
				}),
				phones: z.array(
					z.object({
						phone: z.string(),
						wa_id: z.string(),
						type: z.enum(['HOME', 'WORK']).default('HOME'),
					})
				),
				urls: z.array(
					z.object({
						url: z.string(),
						type: z.enum(['HOME', 'WORK']).default('HOME'),
					})
				),
			})
			.array()
			.optional(),
		context: z
			.object({
				message_id: z.string(),
			})
			.optional(),
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

export async function NumbersValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z
		.object({
			numbers: z.string().array().default([]),
			phonebook_ids: z
				.string()
				.array()
				.default([])
				.refine((ids) => !ids.some((value) => !Types.ObjectId.isValid(value)))
				.transform((ids) => ids.map((value) => new Types.ObjectId(value))),
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
