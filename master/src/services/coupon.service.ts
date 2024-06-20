/* eslint-disable @typescript-eslint/no-explicit-any */
import APIInstance from '../config/APIInstance';

export default class CouponService {
	static async listCoupons() {
		try {
			const { data } = await APIInstance.get('/coupon');
			return (data.list ?? []).map((coupon: any) => {
				return {
					id: coupon.id,
					couponCode: coupon.code ?? '',
					availableCoupon: coupon.available_coupons ?? 0,
					couponPerUser: coupon.coupon_per_user ?? 0,
					discountAmount: coupon.discount_amount ?? 0,
					discountPercentage: coupon.discount_percentage ?? 0,
					discountType: coupon.discount_type ?? 'percentage',
					totalCoupons: coupon.total_coupons ?? 0,
				};
			});
		} catch (err) {
			return [];
		}
	}
	static async createCoupon(coupon: any) {
		try {
			const { data } = await APIInstance.post('/coupon', coupon);
			return {
				id: data?.coupon.id,
				couponCode: data?.coupon.code ?? '',
				availableCoupon: data?.coupon.available_coupons ?? 0,
				couponPerUser: data?.coupon.count_per_user ?? 0,
				discountAmount: data?.coupon.discount_amount ?? 0,
				discountPercentage: data?.coupon.discount_percentage ?? 0,
				discountType: data?.coupon.discount_type ?? 'percentage',
				totalCoupons: data?.coupon.total_coupons ?? 0,
			};
		} catch (err) {
			return false;
		}
	}
	static async updateCoupon(id: string, coupon: any) {
		try {
			const { data } = await APIInstance.put(`/coupon/${id}`, coupon);
			return {
				id: data?.coupon.id,
				couponCode: data?.coupon.code ?? '',
				availableCoupon: data?.coupon.available_coupons ?? 0,
				couponPerUser: data?.coupon.count_per_user ?? 0,
				discountAmount: data?.coupon.discount_amount ?? 0,
				discountPercentage: data?.coupon.discount_percentage ?? 0,
				discountType: data?.coupon.discount_type ?? 'percentage',
				totalCoupons: data?.coupon.total_coupons ?? 0,
			};
		} catch (err) {
			return false;
		}
	}
	static async deleteCoupon(id: string) {
		try {
			await APIInstance.delete(`/coupon/${id}`);
			return true;
		} catch (err) {
			return false;
		}
	}
}
