export type FAQState = {
	list: FAQ[];
	details: FAQ;
	ui: {
		isLoading: boolean;
		isEditing: boolean;
		isAdding: boolean;
	};
};

export type FAQ = {
	title: string;
	info: string;
};
