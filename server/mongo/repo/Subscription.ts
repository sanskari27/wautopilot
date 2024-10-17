import mongoose, { Schema } from 'mongoose';
import { SUBSCRIPTION_STATUS } from '../../src/config/const';
import ISubscription from '../types/subscription';
import { AccountDB_name } from './Account';
import { PlanDB_name } from './Plan';

export const SubscriptionDB_name = 'Subscription';

const schema = new mongoose.Schema<ISubscription>({
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

	billing_details: {
		name: String,
		phone_number: String,
		email: String,
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
		},
	},

	subscription_status: {
		type: String,
		enum: Object.values(SUBSCRIPTION_STATUS),
		default: SUBSCRIPTION_STATUS.ACTIVE,
		required: true,
	},
	gross_amount: {
		type: Number,
		required: true,
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

	order_id: String,
	token_id: String,
});

const SubscriptionDB = mongoose.model<ISubscription>(SubscriptionDB_name, schema);

export default SubscriptionDB;
