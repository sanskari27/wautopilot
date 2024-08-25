import axios from 'axios';
import { Types } from 'mongoose';
import { WebhookDB } from '../../mongo';
import APIKeyDB from '../../mongo/repo/APIKey';
import IAccount from '../../mongo/types/account';
import IAPIKey from '../../mongo/types/apiKeys';
import IWebhook from '../../mongo/types/webhook';
import IWhatsappLink from '../../mongo/types/whatsappLink';
import { CustomError, ERRORS } from '../errors';
import DateUtils from '../utils/DateUtils';
import UserService from './user';

function processDocs(doc: Omit<IAPIKey, 'device_id'> & { device_id: IWhatsappLink }) {
	return {
		id: doc._id,
		name: doc.name,
		device: doc.device_id.verifiedName,
		permissions: doc.permissions,
		createdAt: DateUtils.getMoment(doc.createdAt).format('YYYY-MM-DD HH:mm:ss'),
	};
}

function processWebhookDocs(doc: Omit<IWebhook, 'device_id'> & { device_id: IWhatsappLink }) {
	return {
		id: doc._id,
		name: doc.name,
		device: doc.device_id.verifiedName,
		url: doc.url,
		createdAt: DateUtils.getMoment(doc.createdAt).format('YYYY-MM-DD HH:mm:ss'),
	};
}

export default class ApiKeyService extends UserService {
	public constructor(account: IAccount) {
		super(account);
	}

	public static async getDoc(token: string) {
		const doc = await APIKeyDB.findOne({ token });
		if (!doc) {
			throw new CustomError(ERRORS.NOT_FOUND);
		}

		return {
			device: doc.device_id,
			linked_to: doc.linked_to,
			permissions: doc.permissions,
		};
	}

	public async listAPIKeys() {
		const docs = await APIKeyDB.find({ linked_to: this.account._id }).populate<{
			device_id: IWhatsappLink;
		}>('device_id');
		return docs.map(processDocs);
	}

	public async createAPIKey(details: {
		name: string;
		device: Types.ObjectId;
		permissions: IAPIKey['permissions'];
	}) {
		const doc = await APIKeyDB.create({
			linked_to: this.account._id,
			device_id: details.device,
			name: details.name,
			permissions: details.permissions,
		});
		return {
			id: doc._id,
			name: doc.name,
			device: doc.device_id,
			permissions: doc.permissions,
			token: doc.token,
			createdAt: DateUtils.getMoment(doc.createdAt).format('YYYY-MM-DD HH:mm:ss'),
		};
	}

	public async deleteAPIKey(id: Types.ObjectId) {
		await APIKeyDB.deleteOne({ _id: id });
	}

	public async regenerateAPIKey(id: Types.ObjectId) {
		const doc = await APIKeyDB.findById(id);
		if (!doc) {
			throw new CustomError(ERRORS.NOT_FOUND);
		}

		doc.token = doc.generateToken();
		await doc.save();
		return doc.token;
	}

	public async listWebhooks() {
		const docs = await WebhookDB.find({ linked_to: this.account._id }).populate<{
			device_id: IWhatsappLink;
		}>('device_id');
		return docs.map(processWebhookDocs);
	}

	public async createWebhook(details: { name: string; device: Types.ObjectId; url: string }) {
		const doc = await WebhookDB.create({
			linked_to: this.account._id,
			device_id: details.device,
			name: details.name,
			url: details.url,
		});
		return {
			id: doc._id,
			name: doc.name,
			device: doc.device_id,
			url: doc.url,
			createdAt: DateUtils.getMoment(doc.createdAt).format('YYYY-MM-DD HH:mm:ss'),
		};
	}

	public async deleteWebhook(id: Types.ObjectId) {
		await WebhookDB.deleteOne({ _id: id });
	}

	public async validateWebhook(id: Types.ObjectId) {
		const doc = await WebhookDB.findOne({ _id: id, linked_to: this.account._id });

		if (!doc) {
			throw new CustomError(ERRORS.NOT_FOUND);
		}

		try {
			await axios.post(doc.url);
		} catch (error) {
			throw new CustomError(ERRORS.NOT_FOUND);
		}
	}

	public async sendWebhook(device: IWhatsappLink, body: any) {
		const docs = await WebhookDB.find({ linked_to: this.account._id, device_id: device._id });

		for (const doc of docs) {
			try {
				await axios.post(doc.url, body);
			} catch (error) {}
		}
	}
}
