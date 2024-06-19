import { Document } from 'mongoose';

export default interface ICoupon extends Document {
	_id: Types.ObjectId;
	code: string;
	available_coupons: number;
	total_coupons: number;
	discount_type: 'percentage' | 'amount';
	discount_amount: number;
	discount_percentage: number;
	count_per_user: number;
}
