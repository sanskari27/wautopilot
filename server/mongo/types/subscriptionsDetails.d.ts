import { Document, Types } from 'mongoose';

export default interface ISubscriptionDetails extends Document {
	_id: Types.ObjectId;
	user: Types.ObjectId;

	plan_id?: Types.ObjectId;
	start_date: Date;
	end_date: Date;
}
