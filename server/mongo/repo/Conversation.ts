import mongoose from 'mongoose';
import IConversation from '../types/conversation';
import { AccountDB_name } from './Account';
import { ConversationMessageDB_name } from './ConversationMessage';
import { WhatsappLinkDB_name } from './WhatsappLink';

export const ConversationDB_name = 'Conversation';

const schema = new mongoose.Schema<IConversation>(
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

		profile_name: String,
		recipient: {
			type: String,
			required: true,
		},
		messages: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: ConversationMessageDB_name,
			},
		],
		assigned_to: mongoose.Schema.Types.ObjectId,
		last_message_at: Date,
		note: {
			type: String,
			default: '',
		},
		pinned: {
			type: Boolean,
			default: false,
		},
		archived: {
			type: Boolean,
			default: false,
		},
		unreadCount: {
			type: Number,
			default: 0,
		},

		message_labels: {
			type: [String],
			default: [],
		},
	},
	{
		timestamps: { createdAt: true },
	}
);

schema.index({ linked_to: 1, recipient: 1, device_id: 1 }, { unique: true });

const ConversationDB = mongoose.model<IConversation>(ConversationDB_name, schema);

export default ConversationDB;
