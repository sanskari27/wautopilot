import { Document, Types } from 'mongoose';

export default interface IPhoneBook extends Document {
	_id: Types.ObjectId;
	linked_to: Types.ObjectId;

	salutation: string;
	first_name: string;
	middle_name: string;
	last_name: string;
	phone_number: string;
	email: string;
	birthday: string;
	anniversary: string;

	labels: string[];

	others: {
		[key: string]: string;
	};
}
