import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

export const signupSchema = z.object({
	email: z.string().email({
		message: 'Invalid email address',
	}),
	password: z.string().min(8, {
		message: 'Password must be at least 8 characters',
	}),
	firstName: z.string({
		message: 'First name is required',
	}),
	lastName: z.string({
		message: 'Last name is required',
	}),
	phone: z.string().min(10, {
		message: 'Phone number must be at least 10 characters',
	}),
});

export const profileSchema = z.object({
	email: z.string().email({
		message: 'Invalid email address',
	}),
	firstName: z.string({
		message: 'First name is required',
	}),
	lastName: z.string({
		message: 'Last name is required',
	}),
	phone: z.string().min(10, {
		message: 'Phone number must be at least 10 characters',
	}),
});

export const forgotSchema = z.object({
	email: z.string().email(),
});

export const resetSchema = z
	.object({
		password: z.string().min(8),
		confirmPassword: z.string().min(8),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['password'],
	});
