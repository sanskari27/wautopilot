import { z } from 'zod';

export const couponSchema = z
	.object({
		id: z.string(),
		couponCode: z.string().min(1, 'Value is required'),
		availableCoupon: z
			.string()
			.min(1, 'Value is required')
			.regex(/^\d+$/, 'Value must be a number'),
		couponPerUser: z.string().min(1, 'Value is required').regex(/^\d+$/, 'Value must be a number'),
		discountAmount: z
			.string()
			.regex(/^\d+$/, 'Value must be a number')
			.refine((data) => {
				return !isNaN(Number(data)) && Number(data) >= 0;
			}, 'Value must be a number and greater than 0'),
		discountPercentage: z
			.string()
			.regex(/^\d+$/, 'Value must be a number')
			.refine((data) => {
				return !isNaN(Number(data)) && Number(data) <= 100 && Number(data) >= 0;
			}, 'Value must be a number between 0 and 100'),
		discountType: z.enum(['amount', 'percentage']),
		totalCoupons: z.string().min(1, 'Value is required').regex(/^\d+$/, 'Value must be a number'),
	})
	.refine((data) => {
		if (data.discountType === 'amount' && Number(data.discountAmount) <= 0) {
			return false;
		}
		if (data.discountType === 'percentage' && Number(data.discountPercentage) <= 0) {
			return false;
		}
		return true;
	});

export type Coupon = z.infer<typeof couponSchema>;
