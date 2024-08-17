import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { API_SECRET } from '../../src/config/const';
import IAPIKey from '../types/apiKeys';
import { AccountDB_name } from './Account';
import { WhatsappLinkDB_name } from './WhatsappLink';

export const APIKeyDB_name = 'APIKey';

const schema = new mongoose.Schema<IAPIKey>(
	{
		linked_to: {
			type: mongoose.Schema.Types.ObjectId,
			ref: AccountDB_name,
			required: true,
		},
		device_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: WhatsappLinkDB_name,
			required: true,
		},

		name: {
			type: String,
			required: true,
		},
		token: {
			type: String,
			required: true,
			select: false,
			default: function () {
				return jwt.sign({ id: this._id }, API_SECRET);
			},
		},
		permissions: {
			messages: {
				create: {
					type: Boolean,
					default: true,
				},
			},
		},
	},
	{
		timestamps: { createdAt: true },
	}
);

schema.methods.generateToken = function () {
	return jwt.sign({ id: this._id }, API_SECRET);
};

const APIKeyDB = mongoose.model<IAPIKey>(APIKeyDB_name, schema);

export default APIKeyDB;
