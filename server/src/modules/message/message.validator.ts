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
