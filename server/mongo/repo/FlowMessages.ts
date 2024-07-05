import mongoose from 'mongoose';
import IFlowMessage from '../types/flowMessages';
import { AccountDB_name } from './Account';
import { WhatsappLinkDB_name } from './WhatsappLink';

export const FlowMessageDB_name = 'FlowMessage';

const schema = new mongoose.Schema<IFlowMessage>(
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
		bot_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'ChatBotFlow',
			required: true,
		},
		recipient: {
			type: String,
			required: true,
		},
		node_id: {
			type: String,
			required: true,
		},
		message_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'ConversationMessage',
			required: true,
		},
		meta_message_id: {
			type: String,
		},
		expires_at: {
			type: Date,
			default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		},
	},
	{
		timestamps: { createdAt: true },
	}
);

const FlowMessageDB = mongoose.model<IFlowMessage>(FlowMessageDB_name, schema);

export default FlowMessageDB;
