import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { CustomError } from '../../errors';

export type CreateCouponValidationResult = {
	code: string;
	total_coupons: number;
	discount_type: 'percentage' | 'amount';
	discount_amount: number;
	discount_percentage: number;
	count_per_user: number;
};

export async function CreateCouponValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		code: z.string().min(1),
		total_coupons: z.number().int(),
		discount_type: z.enum(['percentage', 'amount']),
		discount_amount: z.number().int().nonnegative(),
		discount_percentage: z.number().int().nonnegative(),
		count_per_user: z.number().int().nonnegative(),
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
