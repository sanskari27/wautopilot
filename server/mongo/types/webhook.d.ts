import { Document, Types } from 'mongoose';

export default interface IWebhook extends Document {
	_id: Types.ObjectId;
	linked_to: Types.ObjectId;
	device_id: Types.ObjectId;

	name: string;
	url: string;
	createdAt: Date;
}
