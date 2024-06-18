export type BroadcastState = {
	name: string;
	template_id: string;
	description: string;
	to: string[];
	labels: string[];

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

	header_file: File | null;
	header_link: string;

	error: {
		type:
			| ''
			| 'NAME'
			| 'TEMPLATE'
			| 'START_DATE'
			| 'START_TIME'
			| 'END_TIME'
			| 'DAILY_MESSAGES_COUNT'
			| 'RECIPIENTS'
			| 'TAGS'
			| 'FILE'
			| 'LINK'
			| 'MEDIA'
			| 'BODY'
			| 'DESCRIPTION';
		message: string;
	};
};
