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
	header: z
		.object({
			type: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT', 'NONE']).default('TEXT'),
			media_id: z.string().optional(),
			text: z
				.array(
					z.object({
						custom_text: z.string(),
						variable_from: z.enum(['custom_text', 'phonebook_data']),
						phonebook_data: z.string().optional(),
						fallback_value: z.string().optional(),
					})
				)
				.optional(),
		})
		.optional(),
	body: z.array(
		z.object({
			custom_text: z.string(),
			variable_from: z.enum(['custom_text', 'phonebook_data']),
			phonebook_data: z.string().optional(),
			fallback_value: z.string().optional(),
		})
	),
	carousel: z
		.object({
			cards: z.array(
				z.object({
					header: z.object({
						media_id: z.string(),
					}),
					body: z.array(
						z.object({
							custom_text: z.string(),
							variable_from: z.enum(['custom_text', 'phonebook_data']),
							phonebook_data: z.string().optional(),
							fallback_value: z.string().optional(),
						})
					),
					buttons: z.array(z.string().array()),
				})
			),
		})
		.optional(),
	buttons: z.array(z.string().array()).optional(),
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
	header: z
		.object({
			type: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT', 'NONE']).default('TEXT'),
			media_id: z.string().optional(),
			text: z
				.array(
					z.object({
						custom_text: z.string(),
						variable_from: z.enum(['custom_text', 'phonebook_data']),
						phonebook_data: z.string().optional(),
						fallback_value: z.string().optional(),
					})
				)
				.optional(),
		})
		.optional(),
	body: z.array(
		z.object({
			custom_text: z.string(),
			variable_from: z.enum(['custom_text', 'phonebook_data']),
			phonebook_data: z.string().optional(),
			fallback_value: z.string().optional(),
		})
	),
	carousel: z
		.object({
			cards: z.array(
				z.object({
					header: z.object({
						media_id: z.string(),
					}),
					body: z.array(
						z.object({
							custom_text: z.string(),
							variable_from: z.enum(['custom_text', 'phonebook_data']),
							phonebook_data: z.string().optional(),
							fallback_value: z.string().optional(),
						})
					),
					buttons: z.array(z.string().array()),
				})
			),
		})
		.optional(),
	buttons: z.array(z.string().array()).optional(),
});

export type Recurring = z.infer<typeof recurringSchema>;
export type RecurringWithId = Recurring & { id: string; active: 'ACTIVE' | 'PAUSED' };
