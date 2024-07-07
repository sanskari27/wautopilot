import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { z } from 'zod';
import { CustomError } from '../../errors';

export type UpgradePlanValidationResult = {
	date: string;
	plan_id?: Types.ObjectId;
};

export type CreateAgentValidationResult = {
	email: string;
	password: string;
	name: string;
	phone: string;
};

export type PermissionsValidationResult = {
	assigned_labels?: string[];
	phonebook?: {
		create: boolean;
		update: boolean;
		delete: boolean;
		export: boolean;
	};
	chatbot?: {
		create: boolean;
		update: boolean;
		delete: boolean;
		export: boolean;
	};
	chatbot_flow?: {
		create: boolean;
		update: boolean;
		delete: boolean;
		export: boolean;
	};
	broadcast?: {
		create: boolean;
		update: boolean;
		report: boolean;
		export: boolean;
	};
	recurring?: {
		create: boolean;
		update: boolean;
		delete: boolean;
		export: boolean;
	};
	media?: {
		create: boolean;
		update: boolean;
		delete: boolean;
	};
	contacts?: {
		create: boolean;
		update: boolean;
		delete: boolean;
	};
	template?: {
		create: boolean;
		update: boolean;
		delete: boolean;
	};
	buttons?: {
		read: boolean;
		export: boolean;
	};
};

export async function UpgradePlanValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		date: z.string(),
		plan_id: z
			.string()
			.refine((value) => Types.ObjectId.isValid(value))
			.transform((value) => new Types.ObjectId(value))
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

export async function CreateAgentValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		name: z.string(),
		phone: z.string(),
		email: z.string().email(),
		password: z.string().min(6),
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

export async function PermissionsValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		assigned_labels: z.array(z.string()).optional(),
		phonebook: z
			.object({
				create: z.boolean(),
				update: z.boolean(),
				delete: z.boolean(),
				export: z.boolean(),
			})
			.optional(),
		chatbot: z
			.object({
				create: z.boolean(),
				update: z.boolean(),
				delete: z.boolean(),
				export: z.boolean(),
			})
			.optional(),
		chatbot_flow: z
			.object({
				create: z.boolean(),
				update: z.boolean(),
				delete: z.boolean(),
				export: z.boolean(),
			})
			.optional(),
		broadcast: z
			.object({
				create: z.boolean(),
				update: z.boolean(),
				report: z.boolean(),
				export: z.boolean(),
			})
			.optional(),
		recurring: z
			.object({
				create: z.boolean(),
				update: z.boolean(),
				delete: z.boolean(),
				export: z.boolean(),
			})
			.optional(),
		media: z
			.object({
				create: z.boolean(),
				update: z.boolean(),
				delete: z.boolean(),
			})
			.optional(),
		contacts: z
			.object({
				create: z.boolean(),
				update: z.boolean(),
				delete: z.boolean(),
			})
			.optional(),
		template: z
			.object({
				create: z.boolean(),
				update: z.boolean(),
				delete: z.boolean(),
			})
			.optional(),
		buttons: z
			.object({
				read: z.boolean(),
				export: z.boolean(),
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
