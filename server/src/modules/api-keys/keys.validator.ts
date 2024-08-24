import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { z } from 'zod';
import { CustomError } from '../../errors';
import { idSchema } from '../../utils/schema';

export type TCreateAPIKey = {
	name: string;
	permissions: {
		messages: {
			create: boolean;
		};
	};
	device: Types.ObjectId;
};

export type TWebhook = {
	name: string;
	url: string;
	device: Types.ObjectId;
};

export async function CreateAPIKeyValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		name: z.string().min(3, 'Name must be at least 3 characters long'),
		device: idSchema,
		permissions: z.object({
			messages: z.object({
				create: z.boolean().default(true),
			}),
		}),
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

export async function WebhookValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		name: z.string().min(3, 'Name must be at least 3 characters long'),
		device: idSchema,
		url: z.string().url(),
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
