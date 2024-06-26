export type PhonebookState = {
	list: PhonebookRecord[];
	details: PhonebookRecord;
	uiDetails: {
		isSaving: boolean;
		isFetching: boolean;
		error: string;
	};
	pagination: {
		page: number;
		maxPage: number;
	};
	selected: string[];
	field_name: string;
	csv: {
		file: File | null;
		labels: string[];
	};
	label_input: string;
	labels: string[];
};

type PhonebookRecord = {
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
