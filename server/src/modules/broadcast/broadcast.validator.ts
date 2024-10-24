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
		text?: {
			custom_text: string;
			phonebook_data: string;
			variable_from: 'custom_text' | 'phonebook_data';
			fallback_value: string;
		}[];
		media_id?: string;
		link?: string;
	};
	body: {
		custom_text: string;
		phonebook_data: string;
		variable_from: 'custom_text' | 'phonebook_data';
		fallback_value: string;
	}[];
	buttons: string[][];
	carousel?: {
		cards: {
			header: {
				media_id: string;
			};
			body: {
				custom_text: string;
				phonebook_data: string;
				variable_from: 'custom_text' | 'phonebook_data';
				fallback_value: string;
			}[];
			buttons: string[][];
		}[];
	};

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

	forceSchedule?: boolean;
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
		text?: {
			custom_text: string;
			phonebook_data: string;
			variable_from: 'custom_text' | 'phonebook_data';
			fallback_value: string;
		}[];
		link?: string | undefined;
		media_id?: string | undefined;
	};
	template_body: {
		custom_text: string;
		phonebook_data: string;
		variable_from: 'custom_text' | 'phonebook_data';
		fallback_value: string;
	}[];
	template_buttons: string[][];
	template_carousel?: {
		cards: {
			header: {
				media_id: string;
			};
			body: {
				custom_text: string;
				phonebook_data: string;
				variable_from: 'custom_text' | 'phonebook_data';
				fallback_value: string;
			}[];
			buttons: string[][];
		}[];
	};
	delay: number;
	startTime: string;
	endTime: string;
};

export async function CreateBroadcastValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		name: z.string().trim(),
		description: z.string().trim().default(''),
		template_id: z.string().trim(),
		template_name: z.string().trim(),
		broadcast_options: z
			.object({
				broadcast_type: z.enum(['instant', 'scheduled']),
				startDate: z.string().trim().optional(),
				startTime: z.string().trim().optional(),
				endTime: z.string().trim().optional(),
				daily_messages_count: z.number().optional(),
			})
			.refine((data) => {
				if (data.broadcast_type === 'scheduled') {
					return data.startDate && data.startTime && data.endTime && data.daily_messages_count;
				}
				return true;
			}),
		to: z.string().trim().array().default([]),
		labels: z.string().trim().array().default([]),
		body: z
			.array(
				z.object({
					custom_text: z.string().trim(),
					phonebook_data: z.string().trim(),
					variable_from: z.enum(['custom_text', 'phonebook_data']),
					fallback_value: z.string().trim(),
				})
			)
			.default([]),
		header: z
			.object({
				type: z.enum(['IMAGE', 'TEXT', 'VIDEO', 'DOCUMENT']),
				text: z
					.array(
						z.object({
							custom_text: z.string().trim(),
							phonebook_data: z.string().trim(),
							variable_from: z.enum(['custom_text', 'phonebook_data']),
							fallback_value: z.string().trim(),
						})
					)
					.optional(),
				media_id: z.string().trim().optional(),
				link: z.string().trim().optional(),
			})
			.optional(),
		buttons: z.array(z.array(z.string().trim())).default([]),

		carousel: z
			.object({
				cards: z.array(
					z.object({
						header: z.object({
							media_id: z.string().trim(),
						}),
						body: z
							.array(
								z.object({
									custom_text: z.string().trim(),
									phonebook_data: z.string().trim(),
									variable_from: z.enum(['custom_text', 'phonebook_data']),
									fallback_value: z.string().trim(),
								})
							)
							.default([]),
						buttons: z.array(z.array(z.string().trim())).default([]),
					})
				),
			})
			.optional(),
		forceSchedule: z.boolean().default(false),
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

export async function CreateRecurringValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		name: z.string().trim(),
		description: z.string().trim().default(''),
		wish_from: z.string().trim(),
		template_id: z.string().trim(),
		template_name: z.string().trim(),

		labels: z.string().trim().array().default([]),
		template_header: z
			.object({
				type: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT']).optional(),
				text: z
					.array(
						z.object({
							custom_text: z.string().trim(),
							phonebook_data: z.string().trim(),
							variable_from: z.enum(['custom_text', 'phonebook_data']),
							fallback_value: z.string().trim(),
						})
					)
					.optional(),
				media_id: z.string().trim().optional(),
				link: z.string().trim().optional(),
			})
			.optional(),
		template_body: z
			.array(
				z.object({
					custom_text: z.string().trim(),
					phonebook_data: z.string().trim(),
					variable_from: z.enum(['custom_text', 'phonebook_data']),
					fallback_value: z.string().trim(),
				})
			)
			.default([]),
		template_buttons: z.array(z.array(z.string().trim())).default([]),

		template_carousel: z
			.object({
				cards: z.array(
					z.object({
						header: z.object({
							media_id: z.string().trim(),
						}),
						body: z
							.array(
								z.object({
									custom_text: z.string().trim(),
									phonebook_data: z.string().trim(),
									variable_from: z.enum(['custom_text', 'phonebook_data']),
									fallback_value: z.string().trim(),
								})
							)
							.default([]),
						buttons: z.array(z.array(z.string().trim())).default([]),
					})
				),
			})
			.optional(),

		delay: z.number().default(0),
		startTime: z.string().trim().trim().default('00:01'),
		endTime: z.string().trim().trim().default('23:59'),
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
