import mongoose from 'mongoose';
import ICoupon from '../types/coupon';

export const CouponDB_name = 'Coupon';

const schema = new mongoose.Schema<ICoupon>(
	{
		code: {
			type: String,
			required: true,
			unique: true,
		},
		available_coupons: {
			type: Number,
			required: true,
		},
		total_coupons: {
			type: Number,
			required: true,
		},
		discount_type: {
			type: String,
			enum: ['percentage', 'amount'],
			required: true,
		},
		discount_amount: {
			type: Number,
			required: true,
		},
		discount_percentage: {
			type: Number,
			required: true,
		},
		count_per_user: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: { createdAt: true },
	}
);

const CouponDB = mongoose.model<ICoupon>(CouponDB_name, schema);

export default CouponDB;
