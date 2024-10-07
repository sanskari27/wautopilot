import { NextFunction, Request, Response } from 'express';
import Logger from 'n23-logger';
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
	const headerSchema = z.object({
		type: z.literal('HEADER'),
		format: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT']),
		text: z.string().trim().optional(),
		example: z
			.object({
				header_text: z.array(z.string().trim()).default([]),
				header_handle: z.array(z.string().trim()).default([]),
			})
			.optional(),
	});

	const bodySchema = z.object({
		type: z.literal('BODY'),
		text: z.string().trim(),
		example: z
			.object({
				body_text: z.array(z.array(z.string().trim())),
			})
			.optional(),
	});

	const footerSchema = z.object({
		type: z.literal('FOOTER'),
		text: z.string().trim(),
	});

	const buttonsSchema = z.object({
		type: z.literal('BUTTONS'),
		buttons: z.array(
			z.object({
				type: z.enum(['URL', 'PHONE_NUMBER', 'QUICK_REPLY', 'VOICE_CALL']),
				text: z.string().trim(),
				url: z.string().trim().optional(),
				phone_number: z.string().trim().optional(),
			})
		),
	});

	const headerCarouselSchema = z.object({
		type: z.literal('HEADER'),
		format: z.enum(['IMAGE', 'VIDEO']),
		example: z.object({
			header_handle: z.array(z.string().trim()).default([]),
		}),
	});

	const carouselSchema = z.object({
		type: z.literal('CAROUSEL'),
		cards: z.array(
			z.object({
				// card_index: z.number(),
				components: z.array(
					z.discriminatedUnion('type', [headerCarouselSchema, bodySchema, buttonsSchema])
				),
			})
		),
	});

	const componentSchema = z.discriminatedUnion('type', [
		headerSchema,
		bodySchema,
		footerSchema,
		buttonsSchema,
		carouselSchema,
	]);

	const reqValidator = z.object({
		name: z.string().trim(),
		category: z.enum(['MARKETING', 'UTILITY']),
		allow_category_change: z.boolean().default(true),
		language: z.string().trim().default('en_US'),
		components: z.array(componentSchema),
	});

	const reqValidatorResult = reqValidator.safeParse(req.body);

	if (reqValidatorResult.success) {
		Logger.debug(reqValidatorResult.data);
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
	const headerSchema = z.object({
		type: z.literal('HEADER'),
		format: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT']),
		text: z.string().trim().optional(),
		example: z
			.object({
				header_text: z.array(z.string().trim()).default([]),
				header_handle: z.array(z.string().trim()).default([]),
			})
			.optional(),
	});

	const bodySchema = z.object({
		type: z.literal('BODY'),
		text: z.string().trim(),
		example: z
			.object({
				body_text: z.array(z.array(z.string().trim())),
			})
			.optional(),
	});

	const footerSchema = z.object({
		type: z.literal('FOOTER'),
		text: z.string().trim(),
	});

	const buttonsSchema = z.object({
		type: z.literal('BUTTONS'),
		buttons: z.array(
			z.object({
				type: z.enum(['URL', 'PHONE_NUMBER', 'QUICK_REPLY', 'VOICE_CALL']),
				text: z.string().trim(),
				url: z.string().trim().optional(),
				phone_number: z.string().trim().optional(),
			})
		),
	});

	const componentSchema = z.discriminatedUnion('type', [
		headerSchema,
		bodySchema,
		footerSchema,
		buttonsSchema,
	]);

	const _res = componentSchema.safeParse(req.body);
	if (_res.success) {
		_res.data;
	}

	const reqValidator = z.object({
		id: z.string().trim(),
		name: z.string().trim(),
		category: z.enum(['MARKETING', 'UTILITY']),
		allow_category_change: z.boolean().default(true),
		language: z.string().trim().default('en_US'),
		components: z.array(componentSchema),
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
