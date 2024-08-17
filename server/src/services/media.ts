import FormData from 'form-data';
import fs from 'fs';
import { Types } from 'mongoose';
import { MediaDB, RecurringBroadcastDB } from '../../mongo';
import ChatBotDB from '../../mongo/repo/Chatbot';
import IAccount from '../../mongo/types/account';
import IMedia from '../../mongo/types/media';
import IWhatsappLink from '../../mongo/types/whatsappLink';
import { IS_PRODUCTION } from '../config/const';
import MetaAPI from '../config/MetaAPI';
import { CustomError } from '../errors';
import COMMON_ERRORS from '../errors/common-errors';
import DateUtils from '../utils/DateUtils';
import FileUtils from '../utils/FileUtils';
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

	static async syncMedia() {
		if (!IS_PRODUCTION) return;
		const medias = await MediaDB.find({
			last_synced: { $lt: DateUtils.getMomentNow().add(-28, 'days').toDate() },
		}).populate<{
			device_id: IWhatsappLink;
		}>('device_id');

		medias.forEach(async (media) => {
			const filepath = __basedir + media.local_path;
			if (!FileUtils.exists(filepath)) {
				await MediaDB.deleteOne({ _id: media._id });
				return;
			}

			const form = new FormData();
			form.append('messaging_product', 'whatsapp');
			form.append('file', fs.createReadStream(filepath));

			const {
				data: { id: media_id },
			} = await MetaAPI(media.device_id.accessToken).post(
				`/${media.device_id.phoneNumberId}/media`,
				form,
				{
					maxContentLength: Infinity,
					maxBodyLength: Infinity,
				}
			);

			const { data } = await MetaAPI(media.device_id.accessToken).get(`/${media_id}`);

			await MediaDB.updateOne(
				{ _id: media._id },
				{
					media_id: media_id,
					media_url: data.url,
					file_length: Number(data.file_size),
					mime_type: data.mime_type,
					last_synced: DateUtils.getMomentNow().toDate(),
				}
			);

			await ChatBotDB.updateOne(
				{ 'template_header.media_id': media.media_id },
				{ 'template_header.media_id': media_id }
			);

			const bots = await ChatBotDB.find({ 'nurturing.template_header.media_id': media.media_id });
			bots.forEach(async (doc) => {
				const nurturing = doc.nurturing.map((item) => {
					if (!item.template_header) return item;
					if (item.template_header.media_id === media.media_id) {
						item.template_header.media_id = media_id;
					}
					return item;
				});
				await ChatBotDB.updateOne({ _id: doc._id }, { nurturing });
			});

			const flows = await ChatBotDB.find({ 'nurturing.template_header.media_id': media.media_id });
			flows.forEach(async (doc) => {
				const nurturing = doc.nurturing.map((item) => {
					if (!item.template_header) return item;
					if (item.template_header.media_id === media.media_id) {
						item.template_header.media_id = media_id;
					}
					return item;
				});
				await ChatBotDB.updateOne({ _id: doc._id }, { nurturing });
			});

			await RecurringBroadcastDB.updateMany(
				{ 'template_header.media_id': media.media_id },
				{ 'template_header.media_id': media_id }
			);
		});
	}
}
MediaService.syncMedia();
