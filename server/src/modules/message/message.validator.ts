import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { CustomError } from '../../errors';

export type CreateBroadcastValidationResult = {
	name: string;
	description: string;
	template_id: string;
	template_name: string;
	to: string[];
	components: (
		| {
				type: 'HEADER';
				parameters: {
					type: 'image' | 'document' | 'video' | 'text';
					content: string;
				}[];
		  }
		| {
				type: 'BODY';
				parameters: {
					text: string;
					type: 'text';
				}[];
		  }
	)[];

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
	const textSchema = z.object({
		type: z.literal('text'),
		text: z.string(),
	});

	const imageHeaderSchema = z.object({
		type: z.enum(['text', 'image', 'document', 'video']),
		content: z.string(),
	});

	const headerSchema = z.object({
		type: z.literal('HEADER'),
		parameters: z.array(imageHeaderSchema),
	});

	const bodySchema = z.object({
		type: z.literal('BODY'),
		parameters: z.array(textSchema),
	});

	const componentSchema = z.discriminatedUnion('type', [headerSchema, bodySchema]);

	const reqValidator = z.object({
		name: z.string(),
		description: z.string(),
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
		to: z.string().array(),
		components: z.array(componentSchema),
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
