import mongoose, { Schema } from 'mongoose';
import IContact from '../types/contact';
import { AccountDB_name } from './Account';

export const ContactDB_name = 'Contact';

const schema = new mongoose.Schema<IContact>(
	{
		linked_to: {
			type: Schema.Types.ObjectId,
			ref: AccountDB_name,
		},

		addresses: [
			{
				street: String,
				city: String,
				state: String,
				zip: String,
				country: String,
				country_code: String,
			},
		],
		birthday: String,
		emails: [
			{
				email: String,
			},
		],
		name: {
			formatted_name: String,
			first_name: String,
			last_name: String,
			middle_name: String,
			suffix: String,
			prefix: String,
		},
		org: {
			company: String,
			department: String,
			title: String,
		},
		phones: [
			{
				phone: String,
				wa_id: String,
			},
		],
		urls: [
			{
				url: String,
			},
		],
	},
	{
		timestamps: { createdAt: true },
	}
);

const ContactDB = mongoose.model<IContact>(ContactDB_name, schema);

export default ContactDB;
