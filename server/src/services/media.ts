import { Types } from 'mongoose';
import { MediaDB } from '../../mongo';
import IAccount from '../../mongo/types/account';
import IMedia from '../../mongo/types/media';
import IWhatsappLink from '../../mongo/types/whatsappLink';
import { CustomError } from '../errors';
import COMMON_ERRORS from '../errors/common-errors';
import WhatsappLinkService from './whatsappLink';

function processMediaDocs(docs: IMedia[]) {
	return docs.map((doc) => ({
		id: doc._id,
		filename: doc.filename,
		file_length: doc.file_length,
		mime_type: doc.mime_type,
		media_id: doc.media_id,
		media_url: doc.media_url,
	}));
}

export default class MediaService extends WhatsappLinkService {
	public constructor(account: IAccount, whatsappLink: IWhatsappLink) {
		super(account, whatsappLink);
	}

	async delete(id: Types.ObjectId) {
		const doc = await MediaDB.findOneAndDelete({
			_id: id,
			linked_to: this.userId,
			device_id: this.deviceId,
		});
		if (!doc) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}
		return doc.local_path;
	}

	async listMedias() {
		const medias = await MediaDB.find({
			linked_to: this.userId,
			device_id: this.deviceId,
		});
		return processMediaDocs(medias);
	}

	async getMedia(id: Types.ObjectId) {
		const media = await MediaDB.findOne({
			linked_to: this.userId,
			device_id: this.deviceId,
			_id: id,
		});
		if (!media) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}
		return processMediaDocs([media])[0];
	}

	async getMediaLocalPath(id: Types.ObjectId) {
		const media = await MediaDB.findOne({
			linked_to: this.userId,
			device_id: this.deviceId,
			_id: id,
		});
		if (!media) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}
		return media.local_path;
	}

	async addMedia(details: {
		filename: string;
		file_length: number;
		mime_type: string;
		media_id: string;
		media_url: string;
		local_path: string;
	}) {
		const media = await MediaDB.create({
			linked_to: this.userId,
			device_id: this.deviceId,
			...details,
		});

		return processMediaDocs([media])[0];
	}

	async totalMediaStorage() {
		const medias = await MediaDB.find({
			linked_to: this.userId,
		});
		return medias.reduce((acc, media) => acc + media.file_length, 0);
	}
}
