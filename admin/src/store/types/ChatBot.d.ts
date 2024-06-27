export type ChatBotState = {
	list: ChatBot[];
	details: ChatBot;
	trigger_gap: {
		time: number;
		type: string;
	};
	response_delay: {
		time: number;
		type: string;
	};
	ui: {
		isAddingBot: boolean;
		isEditingBot: boolean;
		triggerError: string;
		messageError: string;
		respondToError: string;
		optionsError: string;
		contactCardsError: string;
		attachmentError: string;
		triggerGapError: string;
		responseGapError: string;
		startAtError: string;
		endAtError: string;
	};
};

export type ChatBot = {
	id: string;
	isActive: boolean;
	respond_to: 'All' | 'SAVED_CONTACTS' | 'NON_SAVED_CONTACTS';
	trigger_gap_seconds: number;
	response_delay_seconds: number;
	trigger: string;
	options:
		| 'INCLUDES_IGNORE_CASE'
		| 'INCLUDES_MATCH_CASE'
		| 'EXACT_IGNORE_CASE'
		| 'EXACT_MATCH_CASE';
	startAt: string;
	endAt: string;
	respond_type: 'template' | 'normal';
	message: string;
	images: string[];
	videos: string[];
	audios: string[];
	documents: string[];
	contacts: string[];
	template_id: string;
	template_name: string;
	template_body: {
		custom_text: string;
		phonebook_data: string;
		variable_from: 'custom_text' | 'phonebook_data';
		fallback_value: string;
	}[];
	template_header: {
		type: 'IMAGE' | 'TEXT' | 'VIDEO' | 'DOCUMENT';
		link: string;
		media_id: string;
	};
	group_respond: boolean;
	nurturing: {
		after: number;
		start_from: string;
		end_at: string;
		template_id: string;
		template_name: string;
		template_body: {
			custom_text: string;
			phonebook_data: string;
			variable_from: 'custom_text' | 'phonebook_data';
			fallback_value: string;
		}[];
		template_header: {
			type: 'IMAGE' | 'TEXT' | 'VIDEO' | 'DOCUMENT';
			link: string;
			media_id: string;
		};
	}[];
};
