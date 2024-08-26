'use server';

import CouponService from '@/services/coupon.service';
import { revalidatePath } from 'next/cache';

export async function editCoupon(
	id: string,
	coupon: {
		code: string;
		total_coupons: number;
		discount_type: 'percentage' | 'amount';
		discount_amount: number;
		discount_percentage: number;
		count_per_user: number;
	}
) {
	await CouponService.updateCoupon(id, coupon);
	revalidatePath('/panel/home/coupons', 'page');
}

export async function createCoupon(coupon: {
	code: string;
	total_coupons: number;
	discount_type: 'percentage' | 'amount';
	discount_amount: number;
	discount_percentage: number;
	count_per_user: number;
}) {
	await CouponService.createCoupon(coupon);
	revalidatePath('/panel/home/coupons', 'page');
}

export async function deleteCoupon(id: string) {
	await CouponService.deleteCoupon(id);
	revalidatePath('/panel/home/coupons', 'page');
}
