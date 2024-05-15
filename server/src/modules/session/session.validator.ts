import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { CustomError } from '../../errors';

export type LoginValidationResult = {
	email: string;
	password: string;
	type: 'user' | 'admin';
	latitude?: number;
	longitude?: number;
};

export type ResetPasswordValidationResult = {
	email: string;
	callbackURL: string;
};

export type UpdatePasswordValidationResult = {
	password: string;
	token: string;
};

export type GoogleLoginValidationResult = {
	token: string;
};

export async function LoginAccountValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		email: z.string().email(),
		password: z.string(),
		type: z.enum(['user', 'admin']).default('user'),
		latitude: z.number().optional(),
		longitude: z.number().optional(),
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

export async function ResetPasswordValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		email: z.string().email(),
		callbackURL: z.string().url(),
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

export async function UpdatePasswordValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		token: z.string(),
		password: z.string(),
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

export async function GoogleLoginValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		token: z.string(),
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
