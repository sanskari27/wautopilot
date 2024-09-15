import { Document, Types } from 'mongoose';

export default interface IQuickReply extends Document {
	_id: Types.ObjectId;
	linked_to: Types.ObjectId;
	type: 'text' | 'button' | 'list' | 'flow' | 'location';
	data: any;
}
