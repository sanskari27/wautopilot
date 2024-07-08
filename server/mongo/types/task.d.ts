import { Document } from 'mongoose';

export default interface ITask extends Document {
	_id: Types.ObjectId;
	linked_to: Types.ObjectId;
	hidden: boolean;
	message: string;
	due_date: Date;
	createdAt: Date;
}
