export type BroadcastState = {
	name: string;
	template_id: string;
	description: string;
	to: string[];

	recipients_from: 'numbers' | 'phonebook';

	broadcast_options: {
		broadcast_type: 'instant' | 'scheduled';
		startDate: string;
		startTime: string;
		endTime: string;
		daily_messages_count: number;
	};

	body: {
		custom_text: string;
		phonebook_data: string;
		variable_from: 'custom_text' | 'phonebook_data';
		fallback_value: string;
	}[];
};
