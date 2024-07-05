import mongoose from 'mongoose';
import { BOT_TRIGGER_OPTIONS, BOT_TRIGGER_TO } from '../../src/config/const';
import IChatBotFlow from '../types/chatbotFlow';
import { AccountDB_name } from './Account';
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
		respond_to: {
			type: String,
			enum: Object.values(BOT_TRIGGER_TO),
			default: BOT_TRIGGER_TO.ALL,
		},
		name: String,
		trigger: String,
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
					],
				},
				id: String,
				position: {
					x: Number,
					y: Number,
				},
				height: Number,
				width: Number,
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
	},
	{
		timestamps: { createdAt: true },
	}
);

const ChatBotFlowDB = mongoose.model<IChatBotFlow>(ChatBotFlowDB_name, schema);

export default ChatBotFlowDB;
