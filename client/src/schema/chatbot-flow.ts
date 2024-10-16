import { z } from 'zod';

export const ChatbotFlowSchema = z.object({
	id: z.string(),
	name: z.string().min(1, 'Name is required'),
	trigger: z.array(z.string().min(1, 'Trigger is required')),
	options: z.union([
		z.literal('INCLUDES_IGNORE_CASE'),
		z.literal('INCLUDES_MATCH_CASE'),
		z.literal('EXACT_IGNORE_CASE'),
		z.literal('EXACT_MATCH_CASE'),
	]),
	trigger_gap_time: z.string().refine((value) => {
		if (isNaN(Number(value))) return false;
		return Number(value) > 0;
	}, 'Trigger gap time must be greater than 0'),
	trigger_gap_type: z.enum(['SEC', 'MINUTE', 'HOUR']).default('MINUTE'),
	startAt: z.string().default('10:00'),
	endAt: z.string().default('18:00'),
	isActive: z.boolean().default(false),
	nurturing: z.array(
		z.object({
			after: z.object({
				type: z.union([z.literal('min'), z.literal('days'), z.literal('hours')]),
				value: z.string(),
			}),
			respond_type: z.union([z.literal('template'), z.literal('normal')]),
			message: z.string(),
			images: z.array(z.string()),
			videos: z.array(z.string()),
			audios: z.array(z.string()),
			documents: z.array(z.string()),
			contacts: z.array(z.string()),
			template_id: z.string(),
			template_name: z.string(),
			template_header: z
				.object({
					type: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT', 'NONE']),
					text: z
						.array(
							z.object({
								custom_text: z.string().trim(),
								phonebook_data: z.string().trim().optional(),
								variable_from: z.enum(['custom_text', 'phonebook_data']),
								fallback_value: z.string().trim().optional(),
							})
						)
						.optional(),
					media_id: z.string().trim().optional(),
					link: z.string().trim().optional(),
				})
				.optional(),
			template_body: z
				.array(
					z.object({
						custom_text: z.string().trim(),
						phonebook_data: z.string().trim().optional(),
						variable_from: z.enum(['custom_text', 'phonebook_data']),
						fallback_value: z.string().trim().optional(),
					})
				)
				.default([]),
			template_buttons: z.array(z.array(z.string().trim())).optional(),
			template_carousel: z
				.object({
					cards: z.array(
						z.object({
							header: z.object({
								media_id: z.string().trim(),
							}),
							body: z
								.array(
									z.object({
										custom_text: z.string().trim(),
										phonebook_data: z.string().trim().optional(),
										variable_from: z.enum(['custom_text', 'phonebook_data']),
										fallback_value: z.string().trim().optional(),
									})
								)
								.default([]),
							buttons: z.array(z.array(z.string().trim())).default([]),
						})
					),
				})
				.optional(),
		})
	),
	forward: z.object({
		number: z.string(),
		message: z.string(),
	}),
});

export type ChatbotFlow = z.infer<typeof ChatbotFlowSchema>;
