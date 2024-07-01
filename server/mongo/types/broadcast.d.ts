import { Document, Types } from 'mongoose';
import { BROADCAST_STATUS } from '../../src/config/const';

export default interface IBroadcast extends Document {
	_id: Types.ObjectId;
	linked_to: Types.ObjectId;
	device_id: Types.ObjectId;

	template_id: string;
	template_name: string;

	name: string;
	description: string;
	status: BROADCAST_STATUS;
	unProcessedMessages: Types.ObjectId[];
	processedMessages: Types.ObjectId[];

	createdAt: Date;

	broadcast_type: 'instant' | 'scheduled';
	startDate: string;
	startTime: string;
	endTime: string;
	daily_messages_count: number;
}
