import mongoose from 'mongoose';
import IMedia from '../types/media';
import { WhatsappLinkDB_name } from './WhatsappLink';

export const MediaDB_name = 'Media';

const schema = new mongoose.Schema<IMedia>({
	linked_to: {
		type: mongoose.Schema.Types.ObjectId,
		ref: MediaDB_name,
	},
	device_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: WhatsappLinkDB_name,
	},
	filename: {
		type: String,
	},
	file_length: {
		type: Number,
	},
	mime_type: {
		type: String,
	},
	media_id: {
		type: String,
	},
	media_url: {
		type: String,
	},
	local_path: {
		type: String,
	},
	last_synced: {
		type: Date,
		default: Date.now,
	},
});

schema.index({ linked_to: 1, device_id: 1, media_id: 1 });

const MediaDB = mongoose.model<IMedia>(MediaDB_name, schema);

export default MediaDB;
