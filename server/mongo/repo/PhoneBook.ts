import mongoose, { Schema } from 'mongoose';
import IPhoneBook from '../types/phonebook';

export const PhoneBookDB_name = 'Phonebook';

const schema = new mongoose.Schema<IPhoneBook>({
	linked_to: {
		type: Schema.Types.ObjectId,
		ref: PhoneBookDB_name,
	},

	salutation: String,
	first_name: String,
	last_name: String,
	middle_name: String,
	phone_number: String,
	email: String,
	birthday: String,
	anniversary: String,
	labels: [String],

	others: {
		type: Schema.Types.Mixed,
		default: {},
	},
});

const PhoneBookDB = mongoose.model<IPhoneBook>(PhoneBookDB_name, schema);

export default PhoneBookDB;
