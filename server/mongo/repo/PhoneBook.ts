import mongoose, { Schema } from 'mongoose';
import IPhoneBook from '../types/phonebook';

export const PhoneBookDB_name = 'Phonebook';

const schema = new mongoose.Schema<IPhoneBook>(
	{
		linked_to: {
			type: Schema.Types.ObjectId,
			ref: PhoneBookDB_name,
		},

		salutation: { type: String, default: '' },
		first_name: { type: String, default: '' },
		last_name: { type: String, default: '' },
		middle_name: { type: String, default: '' },
		phone_number: { type: String, default: '' },
		email: { type: String, default: '' },
		birthday: { type: String, default: '' },
		anniversary: { type: String, default: '' },
		labels: {
			type: [String],
			default: [],
		},

		others: {
			type: Schema.Types.Mixed,
			default: {},
		},
	},
	{
		timestamps: { createdAt: true },
	}
);

const PhoneBookDB = mongoose.model<IPhoneBook>(PhoneBookDB_name, schema);

export default PhoneBookDB;
