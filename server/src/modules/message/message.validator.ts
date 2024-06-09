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
		body: z.array(
			z.object({
				custom_text: z.string(),
				phonebook_data: z.string(),
				variable_from: z.enum(['custom_text', 'phonebook_data']),
				fallback_value: z.string(),
			})
		),
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
