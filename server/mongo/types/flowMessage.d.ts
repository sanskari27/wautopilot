import { Document, Types } from 'mongoose';

export default interface IFlowMessage extends Document {
	_id: Types.ObjectId;
	linked_to: Types.ObjectId;
	device_id: Types.ObjectId;

	bot_id: Types.ObjectId;
	message_id: Types.ObjectId;
	recipient: string;
	node_id: string;
	meta_message_id: string;

	createdAt: Date;
	expires_at: Date;
}
