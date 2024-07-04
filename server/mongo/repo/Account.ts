import { randomBytes, scrypt } from 'crypto';
import mongoose from 'mongoose';
import { UserLevel } from '../../src/config/const';
import IAccount from '../types/account';

export const AccountDB_name = 'Account';

const schema = new mongoose.Schema<IAccount>({
	parent: {
		type: mongoose.Schema.Types.ObjectId,
		ref: AccountDB_name,
	},
	name: {
		type: String,
	},
	phone: {
		type: String,
		unique: true,
	},
	email: {
		type: String,
		unique: true,
	},
	password: {
		type: String,
		select: false,
	},
	userLevel: {
		type: Number,
		default: UserLevel.Admin,
	},
	markupPrice: {
		type: Number,
		default: 0.03,
	},
	walletBalance: {
		type: Number,
		default: 0,
	},
});

schema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();

	try {
		this.password = await hashPassword(this.password);
		return next();
	} catch (err: any) {
		return next(err);
	}
});

schema.methods.verifyPassword = async function (password: string) {
	return await matchPassword(password, this.password);
};

schema.index({ email: 1 }, { unique: true });

const AccountDB = mongoose.model<IAccount>(AccountDB_name, schema);

export default AccountDB;

const encryptPassword = (password: string, salt: string) => {
	return new Promise((resolve, reject) => {
		scrypt(password, salt, 32, (err, buffer) => {
			if (err) {
				return reject(err);
			}
			resolve(buffer.toString('hex'));
		});
	});
};

const hashPassword = async (password: string) => {
	const salt = randomBytes(16).toString('hex');
	return `${salt}.${await encryptPassword(password, salt)}`;
};

export const matchPassword = async (password: string, hash: string) => {
	const [salt, originalPassHash] = hash.split('.');

	const currentPassHash = await encryptPassword(password, salt);
	return originalPassHash === currentPassHash;
};
