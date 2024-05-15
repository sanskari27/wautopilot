import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import mongoose, { Schema } from 'mongoose';
import { JWT_EXPIRE, JWT_SECRET, REFRESH_EXPIRE, REFRESH_SECRET } from '../../src/config/const';
import ISession from '../types/session';
import { AccountDB_name } from './Account';

export const SessionDB_name = 'Session';

const schema = new mongoose.Schema<ISession>({
	account: {
		type: Schema.Types.ObjectId,
		ref: AccountDB_name,
		required: true,
	},
	loginAt: {
		type: Date,
		default: Date.now,
	},
	expireAt: {
		type: Date,
		default: () => Date.now() + 1000 * 60 * 60 * 24 * 28, // 28 days
		index: true,
		expires: 0,
	},
	refreshToken: {
		type: String,
		unique: true,
		default: () => crypto.randomUUID(),
	},
	ipAddress: {
		type: String,
		default: '',
	},
	platform: {
		type: String,
		default: '',
	},
	browser: {
		type: String,
		default: '',
	},
	latitude: {
		type: Number,
		default: 0,
	},
	longitude: {
		type: Number,
		default: 0,
	},
});

schema.methods.getAuthToken = function () {
	return jwt.sign({ id: this._id }, JWT_SECRET, {
		expiresIn: JWT_EXPIRE,
	});
};

schema.methods.getRefreshToken = function () {
	return jwt.sign({ id: this.refreshToken }, REFRESH_SECRET, {
		expiresIn: REFRESH_EXPIRE,
	});
};

const SessionDB = mongoose.model<ISession>(SessionDB_name, schema);

export default SessionDB;
