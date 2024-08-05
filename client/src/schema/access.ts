import { z } from 'zod';

export const permissionsSchema = z.object({
	phonebook: z.object({
		create: z.boolean(),
		update: z.boolean(),
		delete: z.boolean(),
		export: z.boolean(),
	}),
	chatbot: z.object({
		create: z.boolean(),
		update: z.boolean(),
		delete: z.boolean(),
		export: z.boolean(),
	}),
	chatbot_flow: z.object({
		create: z.boolean(),
		update: z.boolean(),
		delete: z.boolean(),
		export: z.boolean(),
	}),
	broadcast: z.object({
		create: z.boolean(),
		update: z.boolean(),
		report: z.boolean(),
		export: z.boolean(),
	}),
	recurring: z.object({
		create: z.boolean(),
		update: z.boolean(),
		delete: z.boolean(),
		export: z.boolean(),
	}),
	media: z.object({
		create: z.boolean(),
		update: z.boolean(),
		delete: z.boolean(),
	}),
	contacts: z.object({
		create: z.boolean(),
		update: z.boolean(),
		delete: z.boolean(),
	}),
	template: z.object({
		create: z.boolean(),
		update: z.boolean(),
		delete: z.boolean(),
	}),
	buttons: z.object({
		read: z.boolean(),
		export: z.boolean(),
	}),
	auto_assign_chats: z.boolean(),
	assigned_labels: z.array(z.string()),
});


export type Permissions = z.infer<typeof permissionsSchema>;