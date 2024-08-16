import { Document, Types } from 'mongoose';
import { BOT_TRIGGER_OPTIONS } from '../../src/config/const';

export default interface IChatBotFlow extends Document {
	_id: Types.ObjectId;
	linked_to: Types.ObjectId;
	device_id: Types.ObjectId;

	name: string;

	trigger: string[];
	options: BOT_TRIGGER_OPTIONS;

	nodes: {
		node_type:
			| 'startNode'
			| 'textNode'
			| 'imageNode'
			| 'audioNode'
			| 'videoNode'
			| 'documentNode'
			| 'buttonNode'
			| 'listNode'
			| 'flowNode'
			| 'endNode';
		id: string;
		position: {
			x: number;
			y: number;
		};
		measured: {
			height: number;
			width: number;
		};
		data?: any;
	}[];
	edges: {
		id: string;
		source: string;
		target: string;
		animated: boolean;
		style?: {
			stroke: string;
		};
		sourceHandle?: string;
		targetHandle?: string;
	}[];
	active: boolean;

	nurturing: {
		after: number;
		respond_type: 'template' | 'normal';
		message: string;
		images: Types.ObjectId[];
		videos: Types.ObjectId[];
		audios: Types.ObjectId[];
		documents: Types.ObjectId[];
		contacts: Types.ObjectId[];
		template_id: string;
		template_name: string;
		template_header?: {
			type: 'IMAGE' | 'TEXT' | 'VIDEO' | 'DOCUMENT';
			media_id?: string;
			link?: string;
		};
		template_body: {
			custom_text: string;
			phonebook_data: string;
			variable_from: 'custom_text' | 'phonebook_data';
			fallback_value: string;
		}[];
	}[];
	forward: { number: string; message: string };
}
