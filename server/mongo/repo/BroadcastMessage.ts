import mongoose, { Schema } from 'mongoose';
import { MESSAGE_STATUS } from '../../src/config/const';
import IBroadcastMessage from '../types/broadcastmessage';
import { AccountDB_name } from './Account';
import { WhatsappLinkDB_name } from './WhatsappLink';

export const BroadcastMessageDB_name = 'BroadcastMessage';

const schema = new mongoose.Schema<IBroadcastMessage>(
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
		broadcast_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Broadcast',
			required: true,
		},

		to: {
			type: String,
			required: true,
		},

		status: {
			type: String,
			enum: Object.keys(MESSAGE_STATUS),
			default: MESSAGE_STATUS.PENDING,
		},

		message_id: String,
		delivered_at: Date,
		read_at: Date,

		header_type: String,
		header_content: String,
		body_content: String,
		footer_content: String,
		button_type: String,
		button_content: String,

		sendAt: {
			type: Date,
			required: true,
		},

		messageObject: {
			type: Schema.Types.Mixed,
			default: {},
		},
	},
	{
		timestamps: { createdAt: true },
	}
);

const BroadcastMessageDB = mongoose.model<IBroadcastMessage>(BroadcastMessageDB_name, schema);

export default BroadcastMessageDB;
