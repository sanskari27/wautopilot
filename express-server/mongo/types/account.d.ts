import { Document, Types } from 'mongoose';

export default interface IAccount extends Document {
	_id: Types.ObjectId;
	name: string;
	phone: string;
	email: string;
	password: string;
	userLevel: UserLevel;

	verifyPassword(password: string): Promise<boolean>;
}
