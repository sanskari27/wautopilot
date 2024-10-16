export type ChatbotFlow = {
	id: string;
	name: string;
	trigger: string[];
	options:
		| 'INCLUDES_IGNORE_CASE'
		| 'INCLUDES_MATCH_CASE'
		| 'EXACT_IGNORE_CASE'
		| 'EXACT_MATCH_CASE';
	isActive: boolean;
	nurturing: {
		after: number;
		respond_type: 'template' | 'normal';
		message: string;
		images: string[];
		videos: string[];
		audios: string[];
		documents: string[];
		contacts: string[];
		template_id: string;
		template_name: string;
		template_body?: {
			custom_text: string;
			phonebook_data?: string;
			variable_from: 'custom_text' | 'phonebook_data';
			fallback_value?: string;
		}[];
		template_header?: {
			type: 'IMAGE' | 'TEXT' | 'VIDEO' | 'DOCUMENT' | 'NONE';
			text?:
				| {
						custom_text: string;
						phonebook_data?: string;
						variable_from: 'custom_text' | 'phonebook_data';
						fallback_value?: string;
				  }[];
			media_id?: string | undefined;
			link?: string | undefined;
		};
		template_buttons?: string[][];
		template_carousel?: {
			cards: {
				header: {
					media_id: string;
				};
				body: {
					custom_text: string;
					phonebook_data?: string;
					variable_from: 'custom_text' | 'phonebook_data';
					fallback_value?: string;
				}[];
				buttons: string[][];
			}[];
		};
	}[];
};
