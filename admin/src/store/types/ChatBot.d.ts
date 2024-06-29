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
	template_header_file: File | null;
	ui: {
		isAddingBot: boolean;
		isEditingBot: boolean;
	};
};

export type ChatBot = {
	id: string;
	isActive: boolean;
	respond_to: 'ALL' | 'SAVED_CONTACTS' | 'NON_SAVED_CONTACTS';
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
	template_header?: {
		type: 'IMAGE' | 'TEXT' | 'VIDEO' | 'DOCUMENT';
		link: string;
		media_id: string;
	};
	group_respond: boolean;
	nurturing: {
		after: {
			value: string;
			type: 'minutes' | 'hours' | 'days';
		};
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
		template_header?: {
			type: 'IMAGE' | 'TEXT' | 'VIDEO' | 'DOCUMENT';
			link: string;
			media_id: string;
		};
	}[];
};
