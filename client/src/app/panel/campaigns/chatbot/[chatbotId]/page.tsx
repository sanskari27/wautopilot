'use client';

import { ChatBot } from '@/schema/chatbot';

const tagsVariable = [
	'{{first_name}}',
	'{{last_name}}',
	'{{middle_name}}',
	'{{phone_number}}',
	'{{email}}',
	'{{birthday}}',
	'{{anniversary}}',
	'{{trigger}}',
];

const tagsVariableMessage = [
	'{{first_name}}',
	'{{last_name}}',
	'{{middle_name}}',
	'{{phone_number}}',
	'{{email}}',
	'{{birthday}}',
	'{{anniversary}}',
];

const DEFAULT_DATA: ChatBot = {
	id: '',
	reply_to_message: false,
	trigger: [],
	options: 'INCLUDES_IGNORE_CASE',
	trigger_gap_time: '1',
	trigger_gap_type: 'SEC',
	response_delay_time: '1',
	response_delay_type: 'SEC',
	startAt: '',
	endAt: '',
	respond_type: 'normal',
	message: '',
	images: [],
	videos: [],
	audios: [],
	documents: [],
	contacts: [],
	template_id: '',
	template_name: '',
	template_body: [],
	template_header: {
		type: 'TEXT',
		link: '',
		media_id: '',
	},
	nurturing: [],
	forward: {
		number: '',
		message: '',
	},
	isActive: false,
};

export default function ChatbotForm() {
	return (
		<div className='custom-scrollbar flex flex-col gap-2 justify-center p-4'>
			{/*--------------------------------- TRIGGER SECTION--------------------------- */}
		</div>
	);
}
