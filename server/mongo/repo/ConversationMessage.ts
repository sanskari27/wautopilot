import mongoose from 'mongoose';
import { MESSAGE_STATUS } from '../../src/config/const';
import IConversationMessage from '../types/conversationMessage';
import { AccountDB_name } from './Account';
import { WhatsappLinkDB_name } from './WhatsappLink';

export const ConversationMessageDB_name = 'ConversationMessage';

const schema = new mongoose.Schema<IConversationMessage>(
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
		conversation_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Conversation',
			required: true,
		},
		recipient: {
			type: String,
			required: true,
		},
		labels: {
			type: [String],
			default: [],
		},

		status: {
			type: String,
			enum: Object.keys(MESSAGE_STATUS),
			default: MESSAGE_STATUS.PENDING,
		},

		message_id: {
			type: String,
			required: true,
		},
		delivered_at: Date,
		read_at: Date,
		sent_at: Date,
		failed_at: Date,
		failed_reason: String,
		received_at: Date,
		seen_at: Date,

		header_type: String,
		header_content_source: String,
		header_content: String,
		body: {
			body_type: String,
			text: String,
			media_id: String,
			media_url: String,
			caption: String,
			contacts: [
				{
					addresses: [
						{
							street: String,
							city: String,
							state: String,
							zip: String,
							country: String,
							country_code: String,
						},
					],
					birthday: String,
					emails: [
						{
							email: String,
						},
					],
					name: {
						formatted_name: String,
						first_name: String,
						last_name: String,
						middle_name: String,
						suffix: String,
						prefix: String,
					},
					org: {
						company: String,
						department: String,
						title: String,
					},
					phones: [
						{
							phone: String,
							wa_id: String,
						},
					],
				},
			],
			location: {
				latitude: String,
				longitude: String,
				name: String,
				address: String,
			},
		},
		footer_content: String,
		buttons: [
			{
				button_type: String,
				button_content: String,
				button_data: String,
			},
		],
		context: {
			from: String,
			id: String,
		},
		scheduled_by: {
			id: mongoose.Schema.Types.ObjectId,
			name: String,
		},
		sender: {
			id: mongoose.Schema.Types.ObjectId,
			name: String,
		},
	},
	{
		timestamps: { createdAt: true },
	}
);

schema.index({ message_id: 1 }, { unique: true });

const ConversationMessageDB = mongoose.model<IConversationMessage>(
	ConversationMessageDB_name,
	schema
);

export default ConversationMessageDB;
