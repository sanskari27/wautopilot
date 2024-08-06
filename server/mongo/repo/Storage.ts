import mongoose from 'mongoose';
import DateUtils from '../../src/utils/DateUtils';
import IStorage, { IStorageModel } from '../types/storage';

const StorageSchema = new mongoose.Schema<IStorage>({
	key: {
		type: String,
		required: true,
		unique: true,
	},
	value: {
		type: String,
	},
	object: {
		type: Object,
	},
	expireAt: {
		type: Date,
		required: true,
		default: () => {
			return DateUtils.getMomentNow().add(5, 'years').toDate();
		},
		index: true,
		expires: 0, // Documents will expire when the time specified in 'expireAt' is reached
	},
});

StorageSchema.statics.getString = async function (key: string): Promise<string | null> {
	const Storage: IStorage = await this.findOne({ key });
	if (Storage === null || Storage.value === undefined) {
		return null;
	}
	return Storage.value;
};

StorageSchema.statics.getObject = async function (key: string): Promise<any | null> {
	const Storage: IStorage = await this.findOne({ key });
	if (Storage === null || Storage.object === undefined) {
		return null;
	}
	return Storage.object;
};

StorageSchema.statics.get = async function (key: string): Promise<{
	exists: boolean;
	data: {
		value: string | null;
		object: any | null;
	} | null;
}> {
	const Storage: IStorage = await this.findOne({ key });
	if (Storage === null) {
		return {
			exists: false,
			data: null,
		};
	}
	return {
		exists: true,
		data: {
			value: Storage.value || null,
			object: Storage.object,
		},
	};
};

StorageSchema.statics.setString = async function (
	key: string,
	value: string,
	expiry: Date = DateUtils.getMomentNow().add(5, 'years').toDate()
): Promise<void> {
	const Storage: IStorage = await this.findOne({ key });

	if (Storage === null) {
		this.create({ key, value, expireAt: expiry });
	} else {
		Storage.value = value;
		Storage.object = undefined;
		Storage.expireAt = expiry;
		await Storage.save();
	}
};

StorageSchema.statics.setObject = async function (
	key: string,
	value: any,
	expiry: Date = DateUtils.getMomentNow().add(5, 'years').toDate()
): Promise<void> {
	const Storage: IStorage = await this.findOne({ key });
	if (Storage === null) {
		this.create({ key, object: value, expireAt: expiry });
	} else {
		Storage.value = undefined;
		Storage.object = value;
		Storage.expireAt = expiry;
		Storage.save();
	}
};

StorageSchema.statics.deleteKey = async function (key: string): Promise<void> {
	await this.deleteOne({ key });
};
const StorageDB = mongoose.model<IStorage, IStorageModel>('Storage', StorageSchema);

export default StorageDB;
