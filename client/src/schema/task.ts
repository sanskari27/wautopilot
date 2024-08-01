import { z } from 'zod';

export const taskDetailsSchema = z.object({
	title: z.string().min(1, {
		message: 'Title is required',
	}),
	description: z.string().min(1, {
		message: 'Description is required',
	}),
	assign_separately: z.boolean(),
	assigned_to: z.array(z.string()).min(1, {
		message: 'Employee is required',
	}),
	category: z.string().min(1, {
		message: 'Category is required',
	}),
	priority: z.string(),
	isRecurring: z.boolean(),
	recurrence: z.object({
		frequency: z.string(),
		start_date: z.date(),
		end_date: z.date(),
		weekdays: z.array(z.string()),
		monthdays: z.array(z.string()),
	}),
	due_date: z.date(),
	links: z.array(z.string()),
	files: z.array(z.string()),
	voice_notes: z.array(z.string()),
	reminders: z.array(
		z.object({
			reminder_type: z.string(),
			before: z.number(),
			before_type: z.string(),
		})
	),
});

export const taskUpdateSchema = z.object({
	message: z.string(),
	links: z.array(z.string()),
	files: z.array(z.string()),
	voice_notes: z.array(z.string()),
	status: z.enum(['pending', 'completed', 'in_progress']),
});
