import api from '@/lib/api';
import { Coupon } from '@/schema/coupon';

export default class CouponService {
	static async listCoupons() {
		try {
			const { data } = await api.get('/coupon');
			return (data.list ?? []).map((coupon: any) => {
				return {
					id: coupon.id,
					couponCode: coupon.code ?? '',
					availableCoupon: (coupon.available_coupons ?? 0).toString(),
					couponPerUser: (coupon.count_per_user ?? 0).toString(),
					discountAmount: (coupon.discount_amount ?? 0).toString(),
					discountPercentage: (coupon.discount_percentage ?? 0).toString(),
					discountType: coupon.discount_type ?? 'percentage',
					totalCoupons: (coupon.total_coupons ?? 0).toString(),
				};
			}) as Coupon[];
		} catch (err) {
			return null;
		}
	}
	static async createCoupon(coupon: {
		code: string;
		total_coupons: number;
		discount_type: 'percentage' | 'amount';
		discount_amount?: number;
		discount_percentage?: number;
		count_per_user: number;
	}) {
		if (coupon.discount_type === 'amount') {
			delete coupon.discount_percentage;
		}
		await api.post('/coupon', coupon);
	}
	static async updateCoupon(
		id: string,
		coupon: {
			code: string;
			total_coupons: number;
			discount_type: 'percentage' | 'amount';
			discount_amount?: number;
			discount_percentage?: number;
			count_per_user: number;
		}
	) {
		if (coupon.discount_type === 'percentage') {
			delete coupon.discount_amount;
		}
		await api.put(`/coupon/${id}`, coupon);
	}
	static async deleteCoupon(id: string) {
		await api.delete(`/coupon/${id}`);
	}
}
