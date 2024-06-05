import { Document, Types } from 'mongoose';
import { UserLevel } from '../../src/config/const';

export default interface IAccount extends Document {
	_id: Types.ObjectId;
	name: string;
	phone: string;
	email: string;
	password: string;
	userLevel: UserLevel;

	marketingPrice: number;
	otherPrice: number;

	verifyPassword(password: string): Promise<boolean>;
}
