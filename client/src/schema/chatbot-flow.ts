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
					text: z.array(
						z.object({
							custom_text: z.string().trim(),
							phonebook_data: z.string().trim(),
							variable_from: z.enum(['custom_text', 'phonebook_data']),
							fallback_value: z.string().trim(),
						})
					).optional(),
					media_id: z.string().trim().optional(),
					link: z.string().trim().optional(),
				})
				.optional(),
			template_body: z
				.array(
					z.object({
						custom_text: z.string().trim(),
						phonebook_data: z.string().trim(),
						variable_from: z.enum(['custom_text', 'phonebook_data']),
						fallback_value: z.string().trim(),
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
										phonebook_data: z.string().trim(),
										variable_from: z.enum(['custom_text', 'phonebook_data']),
										fallback_value: z.string().trim(),
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

const d = {
	id: '670c1f8ab9da1e12cf7a8b05',
	name: '2134',
	trigger: ['new%20structure'],
	options: 'INCLUDES_IGNORE_CASE',
	isActive: true,
	nurturing: [
		{
			message: '',
			respond_type: 'template',
			images: [],
			videos: [],
			audios: [],
			documents: [],
			contacts: [],
			template_id: '3837455136535795',
			template_name: 'product_catalog',
			template_body: [],
			template_header: { type: '', media_id: '', link: '', text: [] },
			template_buttons: [],
			template_carousel: {
				cards: [
					{
						header: { media_id: '493756323632033' },
						body: [
							{
								custom_text: '{{1}}',
								phonebook_data: '',
								variable_from: 'custom_text',
								fallback_value: '',
								_id: '670c30193cf68d07f6e1f926',
							},
							{
								custom_text: '{{2}}',
								phonebook_data: '',
								variable_from: 'custom_text',
								fallback_value: '',
								_id: '670c30193cf68d07f6e1f927',
							},
						],
						buttons: [[]],
						_id: '670c30193cf68d07f6e1f925',
					},
					{
						header: { media_id: '504803905726510' },
						body: [
							{
								custom_text: '{{1}}',
								phonebook_data: '',
								variable_from: 'custom_text',
								fallback_value: '',
								_id: '670c30193cf68d07f6e1f929',
							},
							{
								custom_text: '{{2}}',
								phonebook_data: '',
								variable_from: 'custom_text',
								fallback_value: '',
								_id: '670c30193cf68d07f6e1f92a',
							},
						],
						buttons: [[]],
						_id: '670c30193cf68d07f6e1f928',
					},
				],
			},
			after: { type: 'min', value: '1' },
		},
	],
	forward: { number: '', message: '' },
};
