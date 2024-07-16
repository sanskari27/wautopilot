import mongoose, { Schema } from 'mongoose';
import IWhatsappFlowResponse from '../types/whatsappFlowResponse';
import { AccountDB_name } from './Account';

export const WhatsappFlowResponseDB_name = 'WhatsappFlowResponse';

const schema = new mongoose.Schema<IWhatsappFlowResponse>({
	linked_to: {
		type: Schema.Types.ObjectId,
		ref: AccountDB_name,
		required: true,
	},

	recipient: String,
	received_at: Date,
	message_id: String,
	context: {
		from: String,
		id: String,
	},
	data: Schema.Types.Mixed,
});

const WhatsappFlowResponseDB = mongoose.model<IWhatsappFlowResponse>(
	WhatsappFlowResponseDB_name,
	schema
);

export default WhatsappFlowResponseDB;
