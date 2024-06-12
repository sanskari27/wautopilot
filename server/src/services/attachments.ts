import { Types } from 'mongoose';
import AttachmentDB from '../../mongo/repo/Attachment';
import IAccount from '../../mongo/types/account';
import IAttachment from '../../mongo/types/attachment';
import IWhatsappLink from '../../mongo/types/whatsapplink';
import { CustomError } from '../errors';
import COMMON_ERRORS from '../errors/common-errors';
import WhatsappLinkService from './whatsappLink';

function processAttachmentDocs(docs: IAttachment[]) {
	return docs.map((doc) => ({
		id: doc._id,
		filename: doc.filename,
		file_length: doc.file_length,
		mime_type: doc.mime_type,
		media_id: doc.media_id,
		media_url: doc.media_url,
	}));
}

export default class AttachmentService extends WhatsappLinkService {
	private whatsappLink: IWhatsappLink;
	public constructor(account: IAccount, whatsappLink: IWhatsappLink) {
		super(account);
		this.whatsappLink = whatsappLink;
	}

	async delete(id: Types.ObjectId) {
		const doc = await AttachmentDB.findOneAndDelete({
			_id: id,
			linked_to: this.userId,
			device_id: this.whatsappLink._id,
		});
		if (!doc) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}
		return doc.filename;
	}

	async listAttachments() {
		const attachments = await AttachmentDB.find({
			linked_to: this.userId,
			device_id: this.whatsappLink._id,
		});
		return processAttachmentDocs(attachments);
	}

	async getAttachment(id: Types.ObjectId) {
		const attachment = await AttachmentDB.findOne({
			linked_to: this.userId,
			device_id: this.whatsappLink._id,
			_id: id,
		});
		if (!attachment) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}
		return processAttachmentDocs([attachment])[0];
	}

	async getAttachmentLocalPath(id: Types.ObjectId) {
		const attachment = await AttachmentDB.findOne({
			linked_to: this.userId,
			device_id: this.whatsappLink._id,
			_id: id,
		});
		if (!attachment) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}
		return attachment.local_path;
	}

	async addAttachment(details: {
		filename: string;
		file_length: number;
		mime_type: string;
		media_id: string;
		media_url: string;
		local_path: string;
	}) {
		const attachment = await AttachmentDB.create({
			linked_to: this.userId,
			device_id: this.whatsappLink._id,
			...details,
		});

		return processAttachmentDocs([attachment])[0];
	}
}
