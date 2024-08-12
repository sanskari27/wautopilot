import { z } from 'zod';

export const templateBodySchema = z.array(
	z
		.object({
			variable_from: z.union([z.literal('custom_text'), z.literal('phonebook_data')]),
			phonebook_data: z.string(),
			fallback_value: z.string(),
			custom_text: z.string(),
		})
		.refine((value) => {
			if (value.variable_from === 'custom_text') {
				return value.custom_text.length > 0;
			} else {
				return value.phonebook_data.length > 0;
			}
		}, 'Either Custom Text or Phonebook Data is required')
);

export const templateHeaderSchema = z
	.object({
		type: z.union([
			z.literal('IMAGE'),
			z.literal('TEXT'),
			z.literal('VIDEO'),
			z.literal('DOCUMENT'),
			z.literal(''),
		]),
		link: z.string(),
		media_id: z.string(),
	})
	.refine((value) => {
		if (value.type === 'IMAGE' || value.type === 'VIDEO' || value.type === 'DOCUMENT') {
			return value.media_id.length > 0;
		} else {
			return true;
		}
	});

export const nurturingSchema = z.array(
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
);

export const chatbotSchema = z.object({
	id: z.string(),
	trigger: z.string(),
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
	trigger_gap_type: z.enum(['SEC', 'MINUTE', 'HOUR']),
	response_delay_time: z.string().refine((value) => {
		if (isNaN(Number(value))) return false;
		return Number(value) > 0;
	}, 'Response delay time must be greater than 0'),
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
	template_body: templateBodySchema,
	template_header: templateHeaderSchema,
	nurturing: nurturingSchema,
	forward: z.object({
		number: z.string(),
		message: z.string(),
	}),

	isActive: z.boolean(),
});

export type ChatBot = z.infer<typeof chatbotSchema>;
