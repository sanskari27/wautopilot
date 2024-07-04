import { Document, Types } from 'mongoose';
import { UserLevel } from '../../src/config/const';

export default interface IAccount extends Document {
	_id: Types.ObjectId;
	parent?: Types.ObjectId;
	name: string;
	phone: string;
	email: string;
	password: string;
	userLevel: UserLevel;
	markupPrice: number;
	walletBalance: number;

	verifyPassword(password: string): Promise<boolean>;
}
