import { z } from 'zod';

export const contactSchema = z.object({
	addresses: z.array(
		z.object({
			type: z.string(),
			street: z.string(),
			city: z.string(),
			state: z.string(),
			zip: z.string(),
			country: z.string(),
			country_code: z.string(),
		})
	),
	birthday: z.string(),
	emails: z.array(
		z.object({
			email: z.string().email('Invalid email address'),
			type: z.string().default('HOME'),
		})
	),
	name: z.object({
		formatted_name: z.string().min(1, 'Display name is required'),
		first_name: z.string().min(1, 'First name is required'),
		last_name: z.string(),
		middle_name: z.string(),
		suffix: z.string(),
		prefix: z.string(),
	}),
	org: z.object({
		company: z.string(),
		department: z.string(),
		title: z.string(),
	}),
	phones: z.array(
		z.object({
			phone: z.string(),
			wa_id: z.string(),
			type: z.string(),
		})
	),
	urls: z.array(
		z.object({
			url: z.string().url('Invalid URL'),
			type: z.string(),
		})
	),
});

export const phonebookSchema = z.object({
	salutation: z.string(),
	first_name: z.string().min(1, 'First name is required'),
	last_name: z.string(),
	middle_name: z.string(),
	phone_number: z.string(),
	email: z.string(),
	birthday: z.string(),
	anniversary: z.string(),
	others: z.record(z.string(), z.string().optional()),
	labels: z.array(z.string()),
});

export type PhonebookRecord = z.infer<typeof phonebookSchema>;
export type PhonebookRecordWithID = PhonebookRecord & { id: string };
export type Contact = z.infer<typeof contactSchema>;
export type ContactWithID = Contact & { id: string; formatted_name: string };
