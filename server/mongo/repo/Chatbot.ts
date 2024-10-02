import mongoose, { Schema } from 'mongoose';
import { BOT_TRIGGER_OPTIONS } from '../../src/config/const';
import IChatBot from '../types/chatbot';
import { AccountDB_name } from './Account';
import { ContactDB_name } from './Contact';
import { MediaDB_name } from './Media';
import { WhatsappLinkDB_name } from './WhatsappLink';

export const ChatBotDB_name = 'ChatBot';

const schema = new mongoose.Schema<IChatBot>(
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
		trigger: [String],
		trigger_gap_seconds: Number,
		response_delay_seconds: Number,
		startAt: String,
		endAt: String,
		options: {
			type: String,
			enum: Object.values(BOT_TRIGGER_OPTIONS),
		},

		respond_type: {
			type: String,
			enum: ['template', 'normal'],
			default: 'normal',
		},
		message: String,
		images: [
			{
				type: Schema.Types.ObjectId,
				ref: MediaDB_name,
			},
		],
		videos: [
			{
				type: Schema.Types.ObjectId,
				ref: MediaDB_name,
			},
		],
		audios: [
			{
				type: Schema.Types.ObjectId,
				ref: MediaDB_name,
			},
		],
		documents: [
			{
				type: Schema.Types.ObjectId,
				ref: MediaDB_name,
			},
		],
		contacts: [
			{
				type: Schema.Types.ObjectId,
				ref: ContactDB_name,
			},
		],
		template_id: String,
		template_name: String,
		template_header: {
			type: {
				type: String,
				enum: ['IMAGE', 'TEXT', 'VIDEO', 'DOCUMENT'],
			},
			media_id: String,
			link: String,
		},
		template_body: [
			{
				custom_text: String,
				phonebook_data: String,
				variable_from: {
					type: String,
					enum: ['custom_text', 'phonebook_data'],
				},
				fallback_value: String,
			},
		],
		nurturing: [
			{
				template_id: String,
				template_name: String,
				after: Number,
				start_from: String,
				end_at: String,
				template_header: {
					type: {
						type: String,
						enum: ['IMAGE', 'TEXT', 'VIDEO', 'DOCUMENT'],
					},
					media_id: String,
					link: String,
				},
				template_body: [
					{
						custom_text: String,
						phonebook_data: String,
						variable_from: {
							type: String,
							enum: ['custom_text', 'phonebook_data'],
						},
						fallback_value: String,
					},
				],
			},
		],
		forward: {
			number: String,
			message: String,
		},
		active: {
			type: Boolean,
			default: true,
		},
		reply_to_message: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: { createdAt: true },
	}
);

const ChatBotDB = mongoose.model<IChatBot>(ChatBotDB_name, schema);

export default ChatBotDB;
