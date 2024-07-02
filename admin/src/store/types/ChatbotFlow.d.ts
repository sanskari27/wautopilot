export type ChatbotFlowState = {
	list: ChatbotFlow[];
	details: ChatbotFlow;
	ui: {
		isAddingBot: boolean;
		isEditingBot: boolean;
		isLoading: boolean;
	};
};

export type ChatbotFlow = {
	id: string;
	name: string;
	trigger: string;
	respond_to: 'ALL' | 'SAVED_CONTACTS' | 'NON_SAVED_CONTACTS';
	options:
		| 'INCLUDES_IGNORE_CASE'
		| 'INCLUDES_MATCH_CASE'
		| 'EXACT_IGNORE_CASE'
		| 'EXACT_MATCH_CASE';
	isActive: boolean;
};
