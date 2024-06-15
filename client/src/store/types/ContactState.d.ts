export type ContactState = {
	list: Contact[];
	contact: Contact;
	pagination: {
		page: number;
		maxPage: number;
	};
	selected: string[];
	uiDetails: {
		fetchingContact: boolean;
		savingContact: boolean;
		errorMessage: string;
	};
};

export type Contact = {
	id: string;
	addresses?: {
		type?: string;
		street?: string;
		city?: string;
		state?: string;
		zip?: string;
		country?: string;
		country_code?: string;
	}[];
	birthday?: string;
	emails?: {
		email?: string;
		type?: string;
	}[];
	name?: {
		formatted_name?: string;
		first_name?: string;
		last_name?: string;
		middle_name?: string;
		suffix?: string;
		prefix?: string;
	};
	org?: {
		company?: string;
		department?: string;
		title?: string;
	};
	phones?: {
		phone?: string;
		wa_id?: string;
		type?: string;
	}[];
	urls?: {
		url?: string;
		type?: string;
	}[];
};
