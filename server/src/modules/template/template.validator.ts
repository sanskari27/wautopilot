import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { CustomError } from '../../errors';

export type TemplateRemoveValidationResult = {
	id: string;
	name: string;
};

export async function TemplateRemoveValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		id: z.string().trim(),
		name: z.string().trim(),
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

export async function TemplateCreateValidator(req: Request, res: Response, next: NextFunction) {
	const textHeaderSchema = z.object({
		format: z.literal('TEXT'),
		text: z.string().trim().max(60, 'Header text must be less than 60 characters'),
		example: z.array(z.string().trim()).default([]),
	});

	const mediaHeaderSchema = z.object({
		format: z.enum(['IMAGE', 'VIDEO', 'DOCUMENT']),
		example: z.string().trim(),
	});

	const headerSchema = z.discriminatedUnion('format', [textHeaderSchema, mediaHeaderSchema]);

	const bodySchema = z.object({
		text: z.string().trim().max(1024, 'Body text must be less than 1024 characters'),
		example: z.array(z.string().trim()).default([]),
	});

	const footerSchema = z.object({
		text: z.string().trim(),
	});

	const replyButtonSchema = z.object({
		type: z.literal('QUICK_REPLY'),
		text: z.string().trim().max(25, 'Button text must be less than 25 characters'),
	});

	const urlButtonSchema = z.object({
		type: z.literal('URL'),
		text: z.string().trim().max(25, 'Button text must be less than 20 characters'),
		url: z.string().trim(),
		example: z.array(z.string().trim()).default([]),
	});

	const phoneButtonSchema = z.object({
		type: z.literal('PHONE_NUMBER'),
		text: z.string().trim().max(25, 'Button text must be less than 20 characters'),
		phone_number: z.string().trim(),
	});

	const flowButtonSchema = z.object({
		type: z.literal('FLOW'),
		text: z.string().trim().max(25, 'Button text must be less than 20 characters'),
		flow_id: z.string().trim(),
		flow_action: z.enum(['navigate', 'data_exchange']),
		navigate_screen: z.string().trim(),
	});

	const buttonsSchema = z.array(
		z.discriminatedUnion('type', [
			replyButtonSchema,
			urlButtonSchema,
			phoneButtonSchema,
			flowButtonSchema,
		])
	);

	const carouselHeaderSchema = z.object({
		format: z.enum(['IMAGE', 'VIDEO']),
		example: z.string().trim(),
	});

	const carouselSchema = z.object({
		cards: z.array(
			z.object({
				header: carouselHeaderSchema,
				body: bodySchema,
				buttons: buttonsSchema,
			})
		),
	});

	const reqValidator = z.object({
		name: z.string().trim(),
		category: z.enum(['MARKETING', 'UTILITY']),
		allow_category_change: z.boolean().default(true),
		language: z.string().trim().default('en_US'),

		header: headerSchema.optional(),
		body: bodySchema,
		footer: footerSchema.optional(),
		buttons: buttonsSchema.optional(),
		carousel: carouselSchema.optional(),
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

export async function TemplateEditValidator(req: Request, res: Response, next: NextFunction) {
	const textHeaderSchema = z.object({
		format: z.literal('TEXT'),
		text: z.string().trim().max(60, 'Header text must be less than 60 characters'),
		example: z.array(z.string().trim()).default([]),
	});

	const mediaHeaderSchema = z.object({
		format: z.enum(['IMAGE', 'VIDEO', 'DOCUMENT']),
		example: z.string().trim(),
	});

	const headerSchema = z.discriminatedUnion('format', [textHeaderSchema, mediaHeaderSchema]);

	const bodySchema = z.object({
		text: z.string().trim().max(1024, 'Body text must be less than 1024 characters'),
		example: z.array(z.string().trim()).default([]),
	});

	const footerSchema = z.object({
		text: z.string().trim(),
	});

	const replyButtonSchema = z.object({
		type: z.literal('QUICK_REPLY'),
		text: z.string().trim().max(25, 'Button text must be less than 25 characters'),
	});

	const urlButtonSchema = z.object({
		type: z.literal('URL'),
		text: z.string().trim().max(25, 'Button text must be less than 20 characters'),
		url: z.string().trim(),
		example: z.array(z.string().trim()).default([]),
	});

	const phoneButtonSchema = z.object({
		type: z.literal('PHONE_NUMBER'),
		text: z.string().trim().max(25, 'Button text must be less than 20 characters'),
		phone_number: z.string().trim(),
	});

	const flowButtonSchema = z.object({
		type: z.literal('FLOW'),
		text: z.string().trim().max(25, 'Button text must be less than 20 characters'),
		flow_id: z.string().trim(),
		flow_action: z.enum(['navigate', 'data_exchange']),
		navigate_screen: z.string().trim(),
	});

	const buttonsSchema = z.array(
		z.discriminatedUnion('type', [
			replyButtonSchema,
			urlButtonSchema,
			phoneButtonSchema,
			flowButtonSchema,
		])
	);

	const carouselHeaderSchema = z.object({
		format: z.enum(['IMAGE', 'VIDEO']),
		example: z.string().trim(),
	});

	const carouselSchema = z.object({
		cards: z.array(
			z.object({
				header: carouselHeaderSchema,
				body: bodySchema,
				buttons: buttonsSchema,
			})
		),
	});

	const reqValidator = z.object({
		id: z.string().trim(),
		name: z.string().trim(),
		category: z.enum(['MARKETING', 'UTILITY']),
		allow_category_change: z.boolean().default(true),
		language: z.string().trim().default('en_US'),

		header: headerSchema.optional(),
		body: bodySchema,
		footer: footerSchema.optional(),
		buttons: buttonsSchema.optional(),
		carousel: carouselSchema.optional(),
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
