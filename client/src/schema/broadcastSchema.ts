import { z } from 'zod';

const instantBroadcast = z.object({
	broadcast_type: z.literal('instant'),
});

const scheduledBroadcast = z.object({
	broadcast_type: z.literal('scheduled'),
	startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	startTime: z.string().regex(/^\d{2}:\d{2}$/),
	endTime: z.string().regex(/^\d{2}:\d{2}$/),
	daily_messages_count: z.number().default(100),
});

export const broadcastSchema = z.object({
	name: z.string().min(1),
	description: z.string().default(''),
	template_id: z.string().min(1),
	template_name: z.string().min(1),
	broadcast_options: z.discriminatedUnion('broadcast_type', [instantBroadcast, scheduledBroadcast]),
	to: z.string().array().default([]),
	labels: z.string().array().default([]),
	recipients_from: z.enum(['numbers', 'tags']).default('numbers'),
	body: z
		.array(
			z.object({
				custom_text: z.string(),
				phonebook_data: z.string(),
				variable_from: z.enum(['custom_text', 'phonebook_data']),
				fallback_value: z.string(),
			})
		)
		.default([])
		.refine((arr) => {
			if (arr.length === 0) {
				return true;
			}
			return arr.every((item) => {
				return (
					(item.variable_from === 'custom_text' && item.custom_text !== '') ||
					(item.variable_from === 'phonebook_data' && item.phonebook_data !== '')
				);
			});
		}, 'All body parameters must have a value'),
	header: z
		.object({
			type: z.enum(['IMAGE', 'TEXT', 'VIDEO', 'DOCUMENT']),
			media_id: z.string().optional(),
			link: z.string().optional(),
		})
		.optional(),
});

export type Broadcast = z.infer<typeof broadcastSchema>;

export const recurringSchema = z.object({
	name: z.string().min(1),
	description: z.string().default(''),
	template_id: z.string().min(1),
	template_name: z.string().min(1),
	wish_from: z.enum(['birthday', 'anniversary']).default('birthday'),
	labels: z.string().array().min(1),
	delay: z.number().default(0),
	startTime: z
		.string()
		.regex(/^\d{2}:\d{2}$/)
		.default('10:00'),
	endTime: z
		.string()
		.regex(/^\d{2}:\d{2}$/)
		.default('18:00'),
	template_body: z
		.array(
			z.object({
				custom_text: z.string(),
				phonebook_data: z.string(),
				variable_from: z.enum(['custom_text', 'phonebook_data']),
				fallback_value: z.string(),
			})
		)
		.default([])
		.refine((arr) => {
			if (arr.length === 0) {
				return true;
			}
			return arr.every((item) => {
				return (
					(item.variable_from === 'custom_text' && item.custom_text !== '') ||
					(item.variable_from === 'phonebook_data' && item.phonebook_data !== '')
				);
			});
		}, 'All body parameters must have a value'),
	template_header: z
		.object({
			type: z.enum(['IMAGE', 'TEXT', 'VIDEO', 'DOCUMENT' ,'']),
			media_id: z.string().optional(),
			link: z.string().optional(),
		})
		.optional(),
});

export type Recurring = z.infer<typeof recurringSchema>;
export type RecurringWithId = Recurring & { id: string; active: 'ACTIVE' | 'PAUSED' };
