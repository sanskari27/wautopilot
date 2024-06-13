import { Document, Types } from 'mongoose';
import { UserLevel } from '../../src/config/const';

export default interface IAccount extends Document {
	_id: Types.ObjectId;
	name: string;
	phone: string;
	email: string;
	password: string;
	userLevel: UserLevel;

	markupPrice: number;

	subscription?: {
		plan_id: Types.ObjectId;
		start_date: Date;
		end_date: Date;
	};

	walletBalance: number;

	verifyPassword(password: string): Promise<boolean>;
}
