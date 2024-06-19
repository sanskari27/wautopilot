import express from 'express';
import { UserLevel } from '../../config/const';
import { IDValidator, VerifyMinLevel } from '../../middleware';
import Controller from './coupon.controller';
import { CreateCouponValidator } from './coupon.validator';

const router = express.Router();

router.route('/details/:code').get(Controller.couponByCode);

router
	.route('/:id')
	.all(IDValidator, VerifyMinLevel(UserLevel.Master))
	.delete(Controller.deleteCoupon)
	.all(CreateCouponValidator)
	.put(Controller.updateCoupon);

router
	.route('/')
	.all(VerifyMinLevel(UserLevel.Master))
	.get(Controller.listCoupons)
	.all(CreateCouponValidator)
	.post(Controller.addCoupon);

export default router;
