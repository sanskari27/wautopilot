import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../../errors';
import COMMON_ERRORS from '../../errors/common-errors';
import CouponService from '../../services/coupon';
import { Respond } from '../../utils/ExpressUtils';
import { CreateCouponValidationResult } from './coupon.validator';

async function addCoupon(req: Request, res: Response, next: NextFunction) {
	const data = req.locals.data as CreateCouponValidationResult;
	try {
		const coupon = await new CouponService(req.locals.serviceAccount).addCoupon(data);

		return Respond({
			res,
			status: 200,
			data: {
				coupon,
			},
		});
	} catch (e) {
		if (e instanceof CustomError) {
			return next(e);
		}
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR, e));
	}
}

async function updateCoupon(req: Request, res: Response, next: NextFunction) {
	const data = req.locals.data as CreateCouponValidationResult;
	try {
		const coupon = await new CouponService(req.locals.serviceAccount).updateCoupon(
			req.locals.id,
			data
		);

		return Respond({
			res,
			status: 200,
			data: {
				coupon,
			},
		});
	} catch (e) {
		if (e instanceof CustomError) {
			return next(e);
		}
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR, e));
	}
}

async function deleteCoupon(req: Request, res: Response, next: NextFunction) {
	const { id, serviceAccount: account } = req.locals;

	try {
		await new CouponService(account).delete(id);
		return Respond({
			res,
			status: 200,
		});
	} catch (err: unknown) {
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR));
	}
}

async function couponByCode(req: Request, res: Response, next: NextFunction) {
	const { serviceAccount: account } = req.locals;
	const { code } = req.params;
	if (!code || typeof code !== 'string') {
		return next(new CustomError(COMMON_ERRORS.INVALID_FIELDS));
	}

	try {
		const coupon = await new CouponService(account).getCouponByCode(code);
		return Respond({
			res,
			status: 200,
			data: {
				coupon,
			},
		});
	} catch (err: unknown) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function listCoupons(req: Request, res: Response, next: NextFunction) {
	const { serviceAccount: account } = req.locals;

	const list = await new CouponService(account).listCoupons();
	return Respond({
		res,
		status: 200,
		data: {
			list,
		},
	});
}

const Controller = {
	addCoupon,
	deleteCoupon,
	updateCoupon,
	couponByCode,
	listCoupons,
};

export default Controller;
