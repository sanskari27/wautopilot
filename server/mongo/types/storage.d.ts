import { Document } from 'mongoose';

export interface IStorageModel extends IStorage, Document {
	getString(key: string): Promise<string | null>;
	getObject(key: string): Promise<any | null>;
	setString(key: string, value: string, expires?: Date): Promise<void>;
	setObject(key: string, value: any, expires?: Date): Promise<void>;
	deleteKey(key: string): Promise<void>;
	get(
		key: string
	): Promise<{ exists: boolean; data: { value: string | null; object: any | null } | null }>;
}

export default interface IStorage extends Document {
	key: string;
	value: string | undefined;
	object: any | undefined;
	expireAt: Date;
}
