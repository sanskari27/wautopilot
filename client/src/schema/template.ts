import { z } from 'zod';

// --------------------------------------headerSchema--------------------------------------

const textHeaderSchema = z.object({
	format: z.literal('TEXT'),
	text: z
		.string()
		.trim()
		.max(60, 'Header text must be less than 60 characters')
		.min(1, 'Header text must be at least 1 character'),
	example: z.array(z.string().trim()).default([]),
});

const mediaHeaderSchema = z.object({
	format: z.enum(['IMAGE', 'VIDEO', 'DOCUMENT']),
	example: z.string().trim(),
});

const noneHeaderSchema = z.object({
	format: z.literal('NONE'),
});

const headerSchema = z
	.discriminatedUnion('format', [textHeaderSchema, mediaHeaderSchema, noneHeaderSchema])
	.default({
		format: 'NONE',
	});

// --------------------------------------bodySchema--------------------------------------

const bodySchema = z.object({
	text: z
		.string()
		.trim()
		.max(1024, 'Body text must be less than 1024 characters')
		.min(1, 'Body text must be at least 1 character'),
	example: z.array(z.string().trim()).default([]),
});

// --------------------------------------footerSchema--------------------------------------

const footerSchema = z
	.object({
		text: z.string().trim().default(''),
	})
	.default({
		text: '',
	});

// --------------------------------------buttonsSchema--------------------------------------

const replyButtonSchema = z.object({
	type: z.literal('QUICK_REPLY'),
	text: z.string().trim().max(25, 'Button text must be less than 25 characters'),
});

const urlButtonSchema = z.object({
	type: z.literal('URL'),
	text: z.string().trim().max(25, 'Button text must be less than 20 characters'),
	url: z.string().trim(),
	example: z.array(z.string().trim()).default([]),
});

const phoneButtonSchema = z.object({
	type: z.literal('PHONE_NUMBER'),
	text: z.string().trim().max(25, 'Button text must be less than 20 characters'),
	phone_number: z.string().trim(),
});

const flowButtonSchema = z.object({
	type: z.literal('FLOW'),
	text: z.string().trim().max(25, 'Button text must be less than 20 characters'),
	flow_id: z.string().trim(),
	flow_action: z.enum(['navigate', 'data_exchange']),
	navigate_screen: z.string().trim(),
});

const buttonsSchema = z.array(
	z.discriminatedUnion('type', [
		replyButtonSchema,
		urlButtonSchema,
		phoneButtonSchema,
		flowButtonSchema,
	])
);

// --------------------------------------carouselSchema--------------------------------------

const carouselHeaderSchema = z.object({
	format: z.enum(['IMAGE', 'VIDEO']),
	example: z.string().trim(),
});

export const carouselSchema = z
	.object({
		cards: z.array(
			z.object({
				header: carouselHeaderSchema,
				body: bodySchema,
				buttons: buttonsSchema,
			})
		),
	})
	.refine((data) => {
		data.cards.some((card) => {
			if (card.body.text.includes('\n')) {
				return false;
			}
		});
		return true;
	});

export const templateSchema = z
	.object({
		name: z.string().trim(),
		category: z.enum(['MARKETING', 'UTILITY']),
		allow_category_change: z.boolean().default(true),
		language: z.string().trim().default('en_US'),

		header: headerSchema.optional(),
		body: bodySchema,
		footer: footerSchema.optional(),
		buttons: buttonsSchema.optional(),
		carousel: carouselSchema.optional(),
	})
	.refine((data) => {
		let isValidate = true;
		if (data.header) {
			if (data.header?.format === 'TEXT') {
				if (data.header.text.length < 1) {
					isValidate = false;
				}
				data.header.example.some((value) => {
					if (!value) {
						isValidate = false;
					}
				});
			}
		}

		if (data.body) {
			if (data.body.text.length < 1) {
				isValidate = false;
			}
			data.body.example.some((value) => {
				if (!value) {
					isValidate = false;
				}
			});
		}

		if (data.carousel) {
			if (data.carousel.cards.length < 1) {
				isValidate = false;
			}
			if (data.carousel.cards.length > 10) {
				isValidate = false;
			}
			data.carousel.cards.some((card) => {
				if (card.header.format === 'IMAGE' || card.header.format === 'VIDEO') {
					if (card.header.example === '') {
						isValidate = false;
					}
				}
				if (card.body.text.length < 1) {
					isValidate = false;
				}
				card.body.example.some((value) => {
					if (!value) {
						isValidate = false;
					}
				});
			});
		}
		if (data.buttons) {
			data.buttons.some((button) => {
				if (button.type === 'URL') {
					if (button.url === '') {
						isValidate = false;
					}
					button.example.some((value) => {
						if (!value) {
							isValidate = false;
						}
					});
				}
			});
		}

		return isValidate;
	});

export type Template = z.infer<typeof templateSchema>;
export type TemplateWithID = Template & { id: string; status: string };
export type Carousel = z.infer<typeof carouselSchema>;
