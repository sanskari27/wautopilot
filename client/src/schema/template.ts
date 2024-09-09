import { countOccurrences } from '@/lib/utils';
import { z } from 'zod';

const headerSchema = z.object({
	type: z.literal('HEADER'),
	format: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT']),
	text: z.string().optional(),
	example: z
		.object({
			header_text: z.array(z.string()).default([]).optional(),
			header_handle: z.array(z.string()).default([]).optional(),
		})
		.optional(),
});

const bodySchema = z.object({
	type: z.literal('BODY'),
	text: z.string().trim(),
	example: z
		.object({
			body_text: z.array(z.array(z.string().trim())),
		})
		.optional(),
});

const footerSchema = z.object({
	type: z.literal('FOOTER'),
	text: z.string(),
});

const buttonsSchema = z.object({
	type: z.literal('BUTTONS'),
	buttons: z.array(
		z.object({
			type: z.enum(['URL', 'PHONE_NUMBER', 'QUICK_REPLY', 'VOICE_CALL']),
			text: z.string(),
			url: z.string().optional(),
			phone_number: z.string().optional(),
		})
	),
});

const componentSchema = z.discriminatedUnion('type', [
	headerSchema,
	bodySchema,
	footerSchema,
	buttonsSchema,
]);

export const templateSchema = z.object({
	name: z
		.string()
		.min(1, 'Template name required')
		.refine((val) => /^[a-z0-9_]+$/.test(val), {
			message: 'Template name must be lowercase without spaces',
		}),
	category: z.enum(['MARKETING', 'UTILITY']),
	allow_category_change: z.boolean().default(true),
	language: z.string().default('en_US'),
	components: z.array(componentSchema).refine((values) => {
		const body = values.find((v) => v.type === 'BODY');
		if (!body) {
			return false;
		}
		if (body.text.length === 0) {
			return false;
		}
		const bodyVariablesCount = countOccurrences(body?.text ?? '');
		if (bodyVariablesCount !== (body.example?.body_text[0].length ?? 0)) {
			return false;
		}
		for (let i = 0; i < bodyVariablesCount; i++) {
			if (body.example?.body_text[0][i].length === 0) {
				return false;
			}
		}
		return true;
	}),
});

export type Template = z.infer<typeof templateSchema>;
export type TemplateWithID = Template & { id: string; status: string };
