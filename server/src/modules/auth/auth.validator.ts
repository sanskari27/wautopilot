import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { CustomError } from '../../errors';

export type LoginValidationResult = {
	email: string;
	password: string;
	latitude?: number;
	longitude?: number;
};

export type RegisterValidationResult = {
	email: string;
	password: string;
	name: string;
	phone: string;
};

export type ResetPasswordValidationResult = {
	email: string;
	callbackURL: string;
};

export type UpdatePasswordValidationResult = {
	password: string;
};

export type GoogleLoginValidationResult = {
	token: string;
};

export async function LoginAccountValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		email: z.string().email(),
		password: z.string(),
		latitude: z.number().default(0),
		longitude: z.number().default(0),
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

export async function RegisterAccountValidator(req: Request, res: Response, next: NextFunction) {
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
