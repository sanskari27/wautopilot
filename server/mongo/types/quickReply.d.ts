import { Document } from 'mongoose';

export default interface IQuickReply extends Document {
	_id: Types.ObjectId;
	linked_to: Types.ObjectId;
	message: string;
}
