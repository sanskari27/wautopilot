import { z } from 'zod';

export const organizationDetailsSchema = z.object({
	name: z.string().min(1),
	industry: z.string().min(1),
	domain: z.string().optional(),
	logo: z.string().optional(),
	address: z
		.object({
			street: z.string().default(''),
			city: z.string().default(''),
			state: z.string().default(''),
			zip: z.string().default(''),
			country: z.string().default(''),
		})
		.default({
			street: '',
			city: '',
			state: '',
			zip: '',
			country: '',
		}),
	timezone: z.string(),
});

export const inviteSchema = z.object({
	email: z.string().email(),
	parent_id: z.string().optional(),
	can_create_others: z.boolean().default(false),
	can_let_others_create: z.boolean().default(false),
});

export const organizationCodeSchema = z.object({
	name: z.string().min(1),
	email: z.string().email(),
});

export const removeSchema = z.object({
	email: z.string().email(),
});
