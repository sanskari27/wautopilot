import { z } from 'zod';

export const chatbotSchema = z.object({
	id: z.string(),
	name: z.string(),
	trigger: z.string(),
	respond_to: z.union([
		z.literal('ALL'),
		z.literal('SAVED_CONTACTS'),
		z.literal('NON_SAVED_CONTACTS'),
	]),
	options: z.union([
		z.literal('INCLUDES_IGNORE_CASE'),
		z.literal('INCLUDES_MATCH_CASE'),
		z.literal('EXACT_IGNORE_CASE'),
		z.literal('EXACT_MATCH_CASE'),
	]),
	trigger_gap_time: z.number().min(0),
	trigger_gap_type: z.enum(['SEC', 'MINUTE', 'HOUR']),
	response_delay_time: z.number().min(0),
	response_delay_type: z.enum(['SEC', 'MINUTE', 'HOUR']),
	startAt: z.string(),
	endAt: z.string(),
	respond_type: z.union([z.literal('template'), z.literal('normal')]),
	message: z.string(),
	images: z.array(z.string()),
	videos: z.array(z.string()),
	audios: z.array(z.string()),
	documents: z.array(z.string()),
	contacts: z.array(z.string()),
	template_id: z.string(),
	template_name: z.string(),
	template_body: z.array(
		z.object({
			custom_text: z.string().min(1, 'Custom text is required'),
			phonebook_data: z.string().min(1, 'Phonebook data is required'),
			variable_from: z.union([z.literal('custom_text'), z.literal('phonebook_data')]),
			fallback_value: z.string().min(1, 'Fallback value is required'),
		})
	),
	template_header: z.object({
		type: z.union([
			z.literal('IMAGE'),
			z.literal('TEXT'),
			z.literal('VIDEO'),
			z.literal('DOCUMENT'),
			z.literal(''),
		]),
		link: z.string(),
		media_id: z.string().min(1, 'Media is required'),
	}),
	group_respond: z.boolean(),
	nurturing: z.array(
		z.object({
			after: z.object({
				value: z.string(),
				type: z.union([z.literal('minutes'), z.literal('hours'), z.literal('days')]),
			}),
			start_from: z.string(),
			end_at: z.string(),
			template_id: z.string(),
			template_name: z.string(),
			template_body: z.array(
				z.object({
					custom_text: z.string(),
					phonebook_data: z.string(),
					variable_from: z.union([z.literal('custom_text'), z.literal('phonebook_data')]),
					fallback_value: z.string(),
				})
			),
			template_header: z.object({
				type: z.union([
					z.literal('IMAGE'),
					z.literal('TEXT'),
					z.literal('VIDEO'),
					z.literal('DOCUMENT'),
					z.literal(''),
				]),
				link: z.string(),
				media_id: z.string(),
			}),
		})
	),
	forward: z.object({
		number: z.string(),
		message: z.string(),
	}),

	isActive: z.boolean(),
});

// export type ChatBot = {
// 	id: string;
// 	isActive: boolean;
// 	respond_to: 'ALL' | 'SAVED_CONTACTS' | 'NON_SAVED_CONTACTS';
// 	trigger_gap_seconds: number;
// 	response_delay_seconds: number;
// 	trigger: string;
// 	options:
// 		| 'INCLUDES_IGNORE_CASE'
// 		| 'INCLUDES_MATCH_CASE'
// 		| 'EXACT_IGNORE_CASE'
// 		| 'EXACT_MATCH_CASE';
// 	startAt: string;
// 	endAt: string;
// 	respond_type: 'template' | 'normal';
// 	message: string;
// 	images: string[];
// 	videos: string[];
// 	audios: string[];
// 	documents: string[];
// 	contacts: string[];
// 	template_id: string;
// 	template_name: string;
// 	template_body: {
// 		custom_text: string;
// 		phonebook_data: string;
// 		variable_from: 'custom_text' | 'phonebook_data';
// 		fallback_value: string;
// 	}[];
// 	template_header: {
// 		type: 'IMAGE' | 'TEXT' | 'VIDEO' | 'DOCUMENT' | '';
// 		link: string;
// 		media_id: string;
// 	};
// 	group_respond: boolean;
// 	nurturing: {
// 		after: {
// 			value: string;
// 			type: 'minutes' | 'hours' | 'days';
// 		};
// 		start_from: string;
// 		end_at: string;
// 		template_id: string;
// 		template_name: string;
// 		template_body: {
// 			custom_text: string;
// 			phonebook_data: string;
// 			variable_from: 'custom_text' | 'phonebook_data';
// 			fallback_value: string;
// 		}[];
// 		template_header: {
// 			type: 'IMAGE' | 'TEXT' | 'VIDEO' | 'DOCUMENT' | '';
// 			link: string;
// 			media_id: string;
// 		};
// 	}[];
// 	forward: {
// 		number: string;
// 		message: string;
// 	};
// };
