import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { CustomError } from '../../errors';

export type TemplateRemoveValidationResult = {
	id: string;
	name: string;
};

export async function TemplateRemoveValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		id: z.string(),
		name: z.string(),
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

export async function TemplateCreateValidator(req: Request, res: Response, next: NextFunction) {
	const headerSchema = z.object({
		type: z.literal('HEADER'),
		format: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT']),
		text: z.string().optional(),
		example: z
			.object({
				header_text: z.array(z.string()).default([]),
				header_handle: z.array(z.string()).default([]),
			})
			.optional(),
	});

	const bodySchema = z.object({
		type: z.literal('BODY'),
		text: z.string(),
		example: z
			.object({
				body_text: z.array(z.array(z.string())),
			})
			.optional(),
	});

	const footerSchema = z.object({
		type: z.literal('FOOTER'),
		text: z.string(),
	});

	const buttonsSchema = z.object({
		type: z.literal('BUTTONS'),
		buttons: z.array(
			z.object({
				type: z.enum(['URL', 'PHONE_NUMBER', 'QUICK_REPLY', 'VOICE_CALL']),
				text: z.string(),
				url: z.string().optional(),
				phone_number: z.string().optional(),
			})
		),
	});

	const componentSchema = z.discriminatedUnion('type', [
		headerSchema,
		bodySchema,
		footerSchema,
		buttonsSchema,
	]);

	const reqValidator = z.object({
		name: z.string(),
		category: z.enum(['MARKETING', 'UTILITY']),
		allow_category_change: z.boolean().default(true),
		language: z.string().default('en_US'),
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

export async function TemplateEditValidator(req: Request, res: Response, next: NextFunction) {
	const headerSchema = z.object({
		type: z.literal('HEADER'),
		format: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT']),
		text: z.string().optional(),
		example: z
			.object({
				header_text: z.array(z.string()).default([]),
				header_handle: z.array(z.string()).default([]),
			})
			.optional(),
	});

	const bodySchema = z.object({
		type: z.literal('BODY'),
		text: z.string(),
		example: z
			.object({
				body_text: z.array(z.array(z.string())),
			})
			.optional(),
	});

	const footerSchema = z.object({
		type: z.literal('FOOTER'),
		text: z.string(),
	});

	const buttonsSchema = z.object({
		type: z.literal('BUTTONS'),
		buttons: z.array(
			z.object({
				type: z.enum(['URL', 'PHONE_NUMBER', 'QUICK_REPLY', 'VOICE_CALL']),
				text: z.string(),
				url: z.string().optional(),
				phone_number: z.string().optional(),
			})
		),
	});

	const componentSchema = z.discriminatedUnion('type', [
		headerSchema,
		bodySchema,
		footerSchema,
		buttonsSchema,
	]);

	const reqValidator = z.object({
		id: z.string(),
		name: z.string(),
		category: z.enum(['MARKETING', 'UTILITY']),
		allow_category_change: z.boolean().default(true),
		language: z.string().default('en_US'),
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
