import { Document, Types } from 'mongoose';
import { SUBSCRIPTION_STATUS } from '../../src/config/const';

export default interface ISubscription extends Document {
	_id: Types.ObjectId;
	linked_to: Types.ObjectId;

	plan_id: Types.ObjectId;

	billing_details: {
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
	};
	order_id: string;
	token_id: string;

	subscription_status: SUBSCRIPTION_STATUS;
	gross_amount: number;
	discount: number;
	total_amount: number;
	tax: number;
}
