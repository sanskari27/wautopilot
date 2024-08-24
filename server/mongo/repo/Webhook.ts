import mongoose from 'mongoose';
import IWebhook from '../types/webhook';
import { AccountDB_name } from './Account';
import { WhatsappLinkDB_name } from './WhatsappLink';

export const WebhookDB_name = 'Webhook';

const schema = new mongoose.Schema<IWebhook>(
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

		name: {
			type: String,
			required: true,
		},
		url: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: { createdAt: true },
	}
);

const WebhookDB = mongoose.model<IWebhook>(WebhookDB_name, schema);

export default WebhookDB;
