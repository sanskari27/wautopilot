import mongoose from 'mongoose';
import { BROADCAST_STATUS } from '../../src/config/const';
import IBroadcast from '../types/broadcast';
import { AccountDB_name } from './Account';
import { ConversationMessageDB_name } from './ConversationMessage';
import { ScheduledMessageDB_name } from './ScheduledMessage';
import { WhatsappLinkDB_name } from './WhatsappLink';

export const BroadcastDB_name = 'Broadcast';

const schema = new mongoose.Schema<IBroadcast>(
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

		template_id: String,
		template_name: String,

		name: {
			type: String,
			required: true,
			default: () => `Broadcast @ ${new Date().toISOString().split('T')[0]}`,
		},
		description: String,
		status: {
			type: String,
			enum: Object.keys(BROADCAST_STATUS),
			default: BROADCAST_STATUS.ACTIVE,
		},

		unProcessedMessages: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: ScheduledMessageDB_name,
			},
		],
		processedMessages: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: ConversationMessageDB_name,
			},
		],
		broadcast_type: {
			type: String,
			enum: ['instant', 'scheduled'],
		},
		startDate: String,
		startTime: String,
		endTime: String,
		daily_messages_count: Number,
	},
	{
		timestamps: { createdAt: true },
	}
);

const BroadcastDB = mongoose.model<IBroadcast>(BroadcastDB_name, schema);

export default BroadcastDB;
