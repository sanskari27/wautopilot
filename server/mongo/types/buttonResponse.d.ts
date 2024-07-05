import { Document, Types } from 'mongoose';

export default interface IButtonResponse extends Document {
	_id: Types.ObjectId;
	linked_to: Types.ObjectId;
	device_id: Types.ObjectId;

	button_id: string;
	button_text: string;
	responseAt: Date;
	recipient: string;
	meta_message_id: string;
	message_id: Types.ObjectId;
	scheduler_id: Types.ObjectId;
	scheduler_name: string;
}
