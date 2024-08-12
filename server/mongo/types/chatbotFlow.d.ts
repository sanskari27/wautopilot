import { Document, Types } from 'mongoose';
import { BOT_TRIGGER_OPTIONS, BOT_TRIGGER_TO } from '../../src/config/const';

export default interface IChatBotFlow extends Document {
	_id: Types.ObjectId;
	linked_to: Types.ObjectId;
	device_id: Types.ObjectId;

	name: string;

	trigger: string;
	respond_to: BOT_TRIGGER_TO;
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
			| 'listNode';
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
}
