import { Document, Types } from 'mongoose';
import { TRANSACTION_STATUS } from '../../src/config/const';

export default interface ICart extends Document {
	_id: Types.ObjectId;
	linked_to: Types.ObjectId;

	plan_id: Types.ObjectId;
	type: 'SUBSCRIPTION' | 'ONE_TIME';
	quantity: number;

	name: string;
	phone_number: string;
	email: string;

	billing_address: {
		street: string;
		city: string;
		district: string;
		state: string;
		country: string;
		pincode: string;
		gstin: string;
	};

	transaction_status: TRANSACTION_STATUS;

	gross_amount: number;

	discount_coupon: string;
	discount: number;

	total_amount: number;
	tax: number;
}
