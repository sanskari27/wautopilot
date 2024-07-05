import { Document, Types } from 'mongoose';

export default interface IConversation extends Document {
	_id: Types.ObjectId;
	linked_to: Types.ObjectId;
	device_id: Types.ObjectId;

	profile_name: string;
	recipient: string;

	meta_conversation_id: string;
	messages: Types.ObjectId[];

	origin: string;

	last_message_at: Date;
	createdAt: Date;
	assigned_to: Types.ObjectId;
}
