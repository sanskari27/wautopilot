import { Document, Types } from 'mongoose';
import { MESSAGE_STATUS } from '../../src/config/const';

export default interface IBroadcastMessage extends Document {
	_id: Types.ObjectId;
	linked_to: Types.ObjectId;
	device_id: Types.ObjectId;
	broadcast_id: Types.ObjectId;

	to: string;

	status: MESSAGE_STATUS;

	message_id: string;
	delivered_at: Date;
	read_at: Date;
	sent_at: Date;
	failed_at: Date;
	failed_reason: string;

	createdAt: Date;
	sendAt: Date;

	messageObject: {
		[key: string]: any;
	};
}
