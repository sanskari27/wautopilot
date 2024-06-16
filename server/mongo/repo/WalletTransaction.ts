import mongoose, { Schema } from 'mongoose';
import IWalletTransaction from '../types/walletTransaction';
import { AccountDB_name } from './Account';

export const WalletTransactionDB_name = 'WalletTransaction';

const schema = new mongoose.Schema<IWalletTransaction>({
	linked_to: {
		type: Schema.Types.ObjectId,
		ref: AccountDB_name,
		required: true,
	},
	amount: {
		type: Number,
		required: true,
	},
	reference_id: {
		type: String,
		unique: true,
		required: true,
	},
	order_id: String,
	payment_id: String,
	status: {
		type: String,
		enum: ['PENDING', 'SUCCESS', 'FAILED'],
		default: 'PENDING',
	},
});

const WalletTransactionDB = mongoose.model<IWalletTransaction>(WalletTransactionDB_name, schema);

export default WalletTransactionDB;
