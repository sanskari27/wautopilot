import { Document, Types } from 'mongoose';
import { BROADCAST_STATUS } from '../../src/config/const';

export default interface IRecurringBroadcast extends Document {
	_id: Types.ObjectId;
	linked_to: Types.ObjectId;
	device_id: Types.ObjectId;

	name: string;
	description: string;
	wish_from: string;
	status: BROADCAST_STATUS;
	labels: string[];

	template_id: string;
	template_name: string;

	delay: number;
	startTime: string;
	endTime: string;
	template_header?: {
		type: 'IMAGE' | 'TEXT' | 'VIDEO' | 'DOCUMENT';
		media_id?: string;
		link?: string;
		text?: {
			custom_text: string;
			phonebook_data: string;
			variable_from: 'custom_text' | 'phonebook_data';
			fallback_value: string;
		}[];
	};
	template_body: {
		custom_text: string;
		phonebook_data: string;
		variable_from: 'custom_text' | 'phonebook_data';
		fallback_value: string;
	}[];
}
