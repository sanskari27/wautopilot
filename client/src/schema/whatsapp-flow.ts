import { z } from 'zod';

const textType = z.object({
	type: z.enum(['TextBody', 'TextCaption', 'TextSubheading', 'TextHeading']),
	text: z.string().min(1, 'Minimum 1 character required').max(80, 'Maximum 80 characters allowed'),
});

const imageType = z.object({
	type: z.literal('Image'),
	src: z.string().min(1, 'Minimum 1 character required'),
	height: z.number().default(300),
	'scale-type': z.literal('contain'),
});

const inputType = z.object({
	type: z.literal('TextInput'),
	name: z
		.string()
		.min(1, 'Minimum 1 character required')
		.max(20, 'Maximum 20 characters allowed')
		.refine(
			(value) => /^[a-zA-Z_]+$/.test(value),
			'Name should contain only alphabets or underscore'
		),
	label: z.string().min(1, 'Minimum 1 character required').max(20, 'Maximum 20 characters allowed'),
	required: z.boolean(),
	'input-type': z.enum(['text', 'number', 'email', 'number', 'password', 'phone']),
	'helper-text': z.string().max(80, 'Maximum 80 characters allowed').optional(),
});

const textAreaType = z.object({
	type: z.enum(['TextArea', 'DatePicker']),
	name: z
		.string()
		.min(1, 'Minimum 1 character required')
		.max(20, 'Maximum 20 characters allowed')
		.refine(
			(value) => /^[a-zA-Z_]+$/.test(value),
			'Name should contain only alphabets or underscore'
		),
	label: z.string().min(1, 'Minimum 1 character required').max(20, 'Maximum 20 characters allowed'),
	required: z.boolean(),
	'helper-text': z.string().max(80, 'Maximum 80 characters allowed').optional(),
});

const selectType = z.object({
	type: z.enum(['RadioButtonsGroup', 'CheckboxGroup', 'Dropdown']),
	name: z
		.string()
		.min(1, 'Minimum 1 character required')
		.max(20, 'Maximum 20 characters allowed')
		.refine(
			(value) => /^[a-zA-Z_]+$/.test(value),
			'Name should contain only alphabets or underscore'
		),
	label: z.string().min(1, 'Minimum 1 character required').max(20, 'Maximum 20 characters allowed'),
	required: z.boolean(),
	'data-source': z.array(z.string().min(1, 'Minimum 1 character required')).min(1),
});

const optInType = z.object({
	type: z.literal('OptIn'),
	name: z
		.string()
		.min(1, 'Minimum 1 character required')
		.max(20, 'Maximum 20 characters allowed')
		.refine(
			(value) => /^[a-zA-Z_]+$/.test(value),
			'Name should contain only alphabets or underscore'
		),
	label: z.string().min(1, 'Minimum 1 character required').max(20, 'Maximum 20 characters allowed'),
	required: z.boolean(),
});

const footerType = z.object({
	type: z.literal('Footer'),
	label: z.string().min(1, 'Minimum 1 character required').max(30, 'Maximum 30 characters allowed'),
});

const types = z.discriminatedUnion('type', [
	textType,
	imageType,
	inputType,
	textAreaType,
	selectType,
	optInType,
	footerType,
]);

const whatsappFlowValidator = z.object({
	screens: z
		.array(
			z.object({
				title: z.string().min(1, 'Minimum 1 character required').default("Screen's title"),
				children: z
					.array(types)
					.min(1)
					.superRefine((values, ctx) => {
						const set = new Set();
						for (let i = 0; i < values.length; i++) {
							const value = values[i];

							if (
								[
									'Footer',
									'TextBody',
									'TextCaption',
									'TextSubheading',
									'TextHeading',
									'Image',
								].includes(values[i].type)
							) {
								continue;
							}
							if ('name' in value && set.has(value.name)) {
								ctx.addIssue({
									code: z.ZodIssueCode.custom,
									message: `${value.name} is already used`,
								});
							}
							if ('name' in value) {
								set.add(value.name);
							}
						}
					}),
			})
		)
		.min(1)
		.max(8),
});

export const whatsappFlowSchema = whatsappFlowValidator;
export type TWhatsappFlow = z.infer<typeof whatsappFlowValidator>;
