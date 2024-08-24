import mongoose, { Schema } from 'mongoose';
import { BOT_TRIGGER_OPTIONS } from '../../src/config/const';
import IChatBotFlow from '../types/chatbotFlow';
import { AccountDB_name } from './Account';
import { ContactDB_name } from './Contact';
import { MediaDB_name } from './Media';
import { WhatsappLinkDB_name } from './WhatsappLink';

export const ChatBotFlowDB_name = 'ChatBotFlow';

const schema = new mongoose.Schema<IChatBotFlow>(
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
		name: String,
		trigger: [String],
		options: {
			type: String,
			enum: Object.values(BOT_TRIGGER_OPTIONS),
		},
		nodes: [
			{
				node_type: {
					type: String,
					enum: [
						'startNode',
						'textNode',
						'imageNode',
						'audioNode',
						'videoNode',
						'documentNode',
						'buttonNode',
						'listNode',
						'flowNode',
						'endNode',
					],
				},
				id: String,
				position: {
					x: Number,
					y: Number,
				},
				measured: {
					height: Number,
					width: Number,
				},
				data: {},
			},
		],
		edges: [
			{
				id: String,
				source: String,
				target: String,
				animated: Boolean,
				style: {
					stroke: String,
				},
				sourceHandle: String,
				targetHandle: String,
			},
		],
		active: {
			type: Boolean,
			default: true,
		},
		nurturing: [
			{
				after: Number,
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
						enum: ['TEXT', 'VIDEO', 'DOCUMENT'],
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
	},
	{
		timestamps: { createdAt: true },
	}
);

const ChatBotFlowDB = mongoose.model<IChatBotFlow>(ChatBotFlowDB_name, schema);

export default ChatBotFlowDB;
