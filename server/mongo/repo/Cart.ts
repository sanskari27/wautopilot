import mongoose, { Schema } from 'mongoose';
import { TRANSACTION_STATUS } from '../../src/config/const';
import ICart from '../types/cart';
import { AccountDB_name } from './Account';
import { PlanDB_name } from './Plan';

export const CartDB_name = 'Cart';

const schema = new mongoose.Schema<ICart>({
	linked_to: {
		type: Schema.Types.ObjectId,
		ref: AccountDB_name,
		required: true,
	},
	plan_id: {
		type: Schema.Types.ObjectId,
		ref: PlanDB_name,
		required: true,
	},
	type: {
		type: String,
		enum: ['SUBSCRIPTION', 'ONE_TIME'],
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	phone_number: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	billing_address: {
		type: {
			street: String,
			city: String,
			district: String,
			state: String,
			country: String,
			pincode: String,
			gstin: String,
		},
		default: {
			street: '',
			city: '',
			district: '',
			state: '',
			country: '',
			pincode: '',
			gstin: '',
		},
	},
	transaction_status: {
		type: String,
		enum: Object.values(TRANSACTION_STATUS),
		default: TRANSACTION_STATUS.PENDING,
		required: true,
	},
	gross_amount: {
		type: Number,
		required: true,
	},
	discount_coupon: {
		type: String,
		default: '',
	},
	discount: {
		type: Number,
		required: true,
		default: 0,
	},
	total_amount: {
		type: Number,
		required: true,
	},
	tax: {
		type: Number,
		required: true,
	},
});

const CartDB = mongoose.model<ICart>(CartDB_name, schema);

export default CartDB;
