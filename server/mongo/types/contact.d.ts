import { Document, Types } from 'mongoose';

export default interface IContact extends Document {
	_id: Types.ObjectId;
	linked_to: Types.ObjectId;

	addresses: {
		type: string;
		street: string;
		city: string;
		state: string;
		zip: string;
		country: string;
		country_code: string;
	}[];
	birthday: string;
	emails: {
		email: string;
		type: string;
	}[];
	name: {
		formatted_name: string;
		first_name: string;
		last_name: string;
		middle_name: string;
		suffix: string;
		prefix: string;
	};
	org: {
		company: string;
		department: string;
		title: string;
	};
	phones: {
		phone: string;
		wa_id: string;
	}[];
	urls: {
		url: string;
	}[];
}
