import mongoose from 'mongoose';
import IAttachment from '../types/attachment';
import { WhatsappLinkDB_name } from './WhatsappLink';

export const AttachmentDB_name = 'Attachment';

const schema = new mongoose.Schema<IAttachment>({
	linked_to: {
		type: mongoose.Schema.Types.ObjectId,
		ref: AttachmentDB_name,
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
});

const AttachmentDB = mongoose.model<IAttachment>(AttachmentDB_name, schema);

export default AttachmentDB;
