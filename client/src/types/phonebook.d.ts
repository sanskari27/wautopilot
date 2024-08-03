export type PhonebookRecord = {
	id: string;
	salutation: string;
	first_name: string;
	last_name: string;
	middle_name: string;
	phone_number: string;
	email: string;
	birthday: string;
	anniversary: string;
	others: {
		[others: string]: string;
	};
	labels: string[];
};
