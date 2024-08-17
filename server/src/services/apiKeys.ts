import { Types } from 'mongoose';
import APIKeyDB from '../../mongo/repo/APIKey';
import IAccount from '../../mongo/types/account';
import IAPIKey from '../../mongo/types/apiKeys';
import { CustomError, ERRORS } from '../errors';
import UserService from './user';

function processDocs(doc: IAPIKey) {
	return {
		id: doc._id,
		name: doc.name,
		device: doc.device_id,
		permissions: doc.permissions,
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
		const docs = await APIKeyDB.find({ linked_to: this.account._id });
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
}
