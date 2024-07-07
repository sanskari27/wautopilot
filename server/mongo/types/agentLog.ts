import { Document, Schema, Types } from 'mongoose';

export default interface IAgentLog extends Document {
	_id: Types.ObjectId;
	linked_to: Types.ObjectId;
	agent_id: Types.ObjectId;
	agent_name: string;
	text: string;
	data: Schema.Types.Mixed;
	createdAt: Date;
}
