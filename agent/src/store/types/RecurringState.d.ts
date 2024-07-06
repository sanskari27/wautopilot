export type RecurringState = {
	list: Recurring[];
	details: Recurring;
	ui: {
		isLoading: boolean;
		isAddingRecurring: boolean;
		isEditingRecurring: boolean;
	};
};

export type Recurring = {
	id: string;
	name: string;
	description: string;
	wish_from: 'birthday' | 'anniversary';
	labels: string[];
	template_id: string;
	template_name: string;
	template_body: {
		custom_text: string;
		phonebook_data: string;
		variable_from: 'custom_text' | 'phonebook_data';
		fallback_value: string;
	}[];
	template_header: {
		type: 'IMAGE' | 'TEXT' | 'VIDEO' | 'DOCUMENT' | '';
		link: string;
		media_id: string;
	};
	delay: number;
	startTime: string;
	endTime: string;
	active: 'ACTIVE' | 'PAUSED';
};
