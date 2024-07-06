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
	view_broadcast_reports?: boolean;
	create_broadcast?: boolean;
	create_recurring_broadcast?: boolean;
	create_phonebook?: boolean;
	update_phonebook?: boolean;
	delete_phonebook?: boolean;
	auto_assign_chats?: boolean;
	create_template?: boolean;
	update_template?: boolean;
	delete_template?: boolean;
	manage_media?: boolean;
	manage_contacts?: boolean;
	manage_chatbot?: boolean;
	manage_chatbot_flows?: boolean;
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
		view_broadcast_reports: z.boolean().optional(),
		create_broadcast: z.boolean().optional(),
		create_recurring_broadcast: z.boolean().optional(),
		create_phonebook: z.boolean().optional(),
		update_phonebook: z.boolean().optional(),
		delete_phonebook: z.boolean().optional(),
		auto_assign_chats: z.boolean().optional(),
		create_template: z.boolean().optional(),
		update_template: z.boolean().optional(),
		delete_template: z.boolean().optional(),
		manage_media: z.boolean().optional(),
		manage_contacts: z.boolean().optional(),
		manage_chatbot: z.boolean().optional(),
		manage_chatbot_flows: z.boolean().optional(),
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
