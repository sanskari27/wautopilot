import { Document, Types } from 'mongoose';

export default interface IWalletTransaction extends Document {
	_id: Types.ObjectId;
	linked_to: Types.ObjectId;

	amount: number;
	reference_id: string;
	order_id: string;
	payment_id: string;
	status: 'PENDING' | 'SUCCESS' | 'FAILED';
}
