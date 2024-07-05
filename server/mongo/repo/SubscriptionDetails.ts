import mongoose from 'mongoose';
import ISubscriptionDetails from '../types/subscriptionDetails';
import { AccountDB_name } from './Account';
import { PlanDB_name } from './Plan';

export const SubscriptionDetailsDB_name = 'SubscriptionDetails';

const schema = new mongoose.Schema<ISubscriptionDetails>({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: AccountDB_name,
		unique: true,
	},
	plan_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: PlanDB_name,
	},
	start_date: Date,
	end_date: Date,
});

const SubscriptionDetailsDB = mongoose.model<ISubscriptionDetails>(
	SubscriptionDetailsDB_name,
	schema
);

export default SubscriptionDetailsDB;
