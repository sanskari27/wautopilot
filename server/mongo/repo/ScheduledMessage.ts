import mongoose, { Schema } from 'mongoose';
import { MESSAGE_STATUS } from '../../src/config/const';
import { default as IScheduledMessage } from '../types/scheduledMessage';
import { AccountDB_name } from './Account';
import { WhatsappLinkDB_name } from './WhatsappLink';

export const ScheduledMessageDB_name = 'ScheduledMessage';

const schema = new mongoose.Schema<IScheduledMessage>(
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
		scheduler_id: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		scheduler_type: String,

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
		sent_at: Date,
		failed_at: Date,
		failed_reason: String,

		sendAt: {
			type: Date,
			required: true,
		},
		message_type: {
			type: String,
			enum: ['template', 'normal', 'interactive'],
		},
		messageObject: {
			_id: false,
			type: Schema.Types.Mixed,
			default: {},
		},
	},
	{
		timestamps: { createdAt: true },
	}
);

const ScheduledMessageDB = mongoose.model<IScheduledMessage>(ScheduledMessageDB_name, schema);

export default ScheduledMessageDB;
