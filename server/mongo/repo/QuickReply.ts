import mongoose from 'mongoose';
import IQuickReply from '../types/quickReply';
import { AccountDB_name } from './Account';

export const QuickReplyDB_name = 'QuickReply';

const schema = new mongoose.Schema<IQuickReply>({
	linked_to: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: AccountDB_name,
	},
	message: {
		type: String,
		required: true,
	},
});

const QuickReplyDB = mongoose.model<IQuickReply>(QuickReplyDB_name, schema);

export default QuickReplyDB;
