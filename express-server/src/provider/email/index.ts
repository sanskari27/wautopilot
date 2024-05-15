import Logger from 'n23-logger';
import { Resend } from 'resend';
import { RESEND_API_KEY } from '../../config/const';
import { PasswordResetTemplate, WelcomeEmailTemplate } from './templates';

const resend = new Resend(RESEND_API_KEY);

export async function sendSimpleText(to: string, subject: string, value: string) {
	const { error } = await resend.emails.send({
		from: 'Info <no-reply@xyz.com>',
		to: [to],
		subject: subject,
		html: `<p>${value}</p>`,
	});

	if (error) {
		Logger.error('Resend Error', error, { details: 'Error Sending feedback message' });
		return false;
	}
	return true;
}

export async function sendWelcomeEmail(to: string) {
	const { error } = await resend.emails.send({
		from: 'ABC <info@abc.com>',
		to: [to],
		subject: 'Welcome to ABC!',
		html: WelcomeEmailTemplate(to),
	});

	if (error) {
		Logger.error('Resend Error', error, { details: 'Error Sending welcome message' });
		return false;
	}
	return true;
}

export async function sendPasswordResetEmail(to: string, token: string) {
	const { error } = await resend.emails.send({
		from: 'ABC <info@abc.com>',
		to: [to],
		subject: 'Password reset request for ABC',
		html: PasswordResetTemplate(token),
	});

	if (error) {
		Logger.error('Resend Error', error, { details: 'Error Sending reset message' });
		return false;
	}
	return true;
}
