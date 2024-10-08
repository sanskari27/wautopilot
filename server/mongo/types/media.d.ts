import { Document, Types } from 'mongoose';

export default interface IMedia extends Document {
	_id: Types.ObjectId;
	linked_to: Types.ObjectId;
	device_id: Types.ObjectId;

	filename: string;
	file_length: number;
	mime_type: string;
	media_id: string;
	media_url: string;
	local_path: string;

	last_synced: Date;
}
