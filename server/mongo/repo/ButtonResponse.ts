import mongoose from 'mongoose';
import IButtonResponse from '../types/buttonResponses';
import { AccountDB_name } from './Account';
import { WhatsappLinkDB_name } from './WhatsappLink';

export const ButtonResponseDB_name = 'ButtonResponse';

const schema = new mongoose.Schema<IButtonResponse>(
	{
		linked_to: {
			type: mongoose.Schema.Types.ObjectId,
			ref: AccountDB_name,
			required: true,
		},
		device_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: WhatsappLinkDB_name,
			required: true,
		},
		button_id: String,
		button_text: {
			type: String,
			required: true,
		},
		responseAt: {
			type: Date,
			default: Date.now,
			required: true,
		},
		recipient: {
			type: String,
			required: true,
		},
		meta_message_id: String,
		message_id: mongoose.Schema.Types.ObjectId,
		scheduler_id: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		scheduler_name: String,
	},
	{
		timestamps: { createdAt: true },
	}
);

const ButtonResponseDB = mongoose.model<IButtonResponse>(ButtonResponseDB_name, schema);

export default ButtonResponseDB;
