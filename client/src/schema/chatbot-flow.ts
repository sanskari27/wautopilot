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
		z
			.object({
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
						z.literal('AUDIO'),
						z.literal(''),
					]),
					media_id: z.string(),
				}),
			})
			.refine((nurturing) => {
				if (nurturing.respond_type === 'template') {
					if (!nurturing.template_id) {
						return false;
					}
					if (!nurturing.template_name) {
						return false;
					}
					if (
						nurturing.template_header.type === 'VIDEO' ||
						nurturing.template_header.type === 'DOCUMENT' ||
						nurturing.template_header.type === 'IMAGE' ||
						nurturing.template_header.type === 'AUDIO'
					) {
						if (!nurturing.template_header.media_id) {
							return false;
						}
					}
					return nurturing.template_body.every((body) => {
						if (body.variable_from === 'custom_text' && !body.custom_text) {
							return false;
						}
						if (body.variable_from === 'phonebook_data') {
							if (!body.phonebook_data && !body.fallback_value) {
								return false;
							}
						}
						return true;
					});
				} else {
					if (
						nurturing.message.length === 0 &&
						nurturing.contacts.length === 0 &&
						nurturing.images.length === 0 &&
						nurturing.videos.length === 0 &&
						nurturing.audios.length === 0 &&
						nurturing.documents.length === 0
					) {
						return false;
					}
				}
				return true;
			})
	),
	forward: z.object({
		number: z.string(),
		message: z.string(),
	}),
});

export type ChatbotFlow = z.infer<typeof ChatbotFlowSchema>;
