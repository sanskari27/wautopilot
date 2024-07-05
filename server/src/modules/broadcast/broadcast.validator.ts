import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { CustomError } from '../../errors';

export type CreateBroadcastValidationResult = {
	name: string;
	description: string;
	template_id: string;
	template_name: string;
	to: string[];
	labels: string[];
	header?: {
		type: 'IMAGE' | 'TEXT' | 'VIDEO' | 'DOCUMENT';
		media_id?: string;
		link?: string;
	};
	body: {
		custom_text: string;
		phonebook_data: string;
		variable_from: 'custom_text' | 'phonebook_data';
		fallback_value: string;
	}[];

	broadcast_options:
		| {
				broadcast_type: 'instant';
		  }
		| {
				broadcast_type: 'scheduled';
				startDate: string;
				startTime: string;
				endTime: string;
				daily_messages_count: number;
		  };
};

export type CreateRecurringValidationResult = {
	name: string;
	description: string;
	wish_from: string;
	labels: string[];
	template_id: string;
	template_name: string;

	template_header?: {
		type: 'IMAGE' | 'TEXT' | 'VIDEO' | 'DOCUMENT';
		link?: string | undefined;
		media_id?: string | undefined;
		text?: string | undefined;
	};
	template_body: {
		custom_text: string;
		phonebook_data: string;
		variable_from: 'custom_text' | 'phonebook_data';
		fallback_value: string;
	}[];
	delay: number;
	startTime: string;
	endTime: string;
};

export async function CreateBroadcastValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		name: z.string(),
		description: z.string().default(''),
		template_id: z.string(),
		template_name: z.string(),
		broadcast_options: z
			.object({
				broadcast_type: z.enum(['instant', 'scheduled']),
				startDate: z.string().optional(),
				startTime: z.string().optional(),
				endTime: z.string().optional(),
				daily_messages_count: z.number().optional(),
			})
			.refine((data) => {
				if (data.broadcast_type === 'scheduled') {
					return data.startDate && data.startTime && data.endTime && data.daily_messages_count;
				}
				return true;
			}),
		to: z.string().array().default([]),
		labels: z.string().array().default([]),
		body: z
			.array(
				z.object({
					custom_text: z.string(),
					phonebook_data: z.string(),
					variable_from: z.enum(['custom_text', 'phonebook_data']),
					fallback_value: z.string(),
				})
			)
			.default([]),
		header: z
			.object({
				type: z.enum(['IMAGE', 'TEXT', 'VIDEO', 'DOCUMENT']),
				media_id: z.string().optional(),
				link: z.string().optional(),
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

export async function CreateRecurringValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		name: z.string(),
		description: z.string().default(''),
		wish_from: z.string(),
		template_id: z.string(),
		template_name: z.string(),

		labels: z.string().array().default([]),
		template_header: z
			.object({
				type: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT']).optional(),
				media_id: z.string().optional(),
				link: z.string().optional(),
				text: z.string().optional(),
			})
			.optional(),
		template_body: z
			.array(
				z.object({
					custom_text: z.string(),
					phonebook_data: z.string(),
					variable_from: z.enum(['custom_text', 'phonebook_data']),
					fallback_value: z.string(),
				})
			)
			.default([]),
		delay: z.number().nonnegative().default(0),
		startTime: z.string().trim().default('00:01'),
		endTime: z.string().trim().default('23:59'),
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
