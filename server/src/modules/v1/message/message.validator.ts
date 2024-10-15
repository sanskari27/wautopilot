import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { CustomError } from '../../../errors';

export type SendMessageValidationResult = {
	message:
		| {
				type: 'text';
				text: string;
		  }
		| {
				type: 'image' | 'video' | 'document' | 'audio';
				media_id: string;
				media_link: string;
		  }
		| {
				type: 'location';
				location: {
					name: string;
					latitude: string;
					longitude: string;
					address: string;
				};
		  }
		| {
				type: 'contacts';
				contacts: {
					name: {
						formatted_name: string;
						first_name: string;
						last_name: string;
						middle_name: string;
						suffix: string;
						prefix: string;
					};
					addresses: {
						street: string;
						city: string;
						state: string;
						zip: string;
						country: string;
						country_code: string;
						type: 'HOME' | 'WORK';
					}[];
					birthday: string;
					emails: {
						email: string;
						type: 'WORK' | 'HOME';
					}[];
					org: {
						company: string;
						department: string;
						title: string;
					};
					phones: {
						phone: string;
						wa_id: string;
						type: 'HOME' | 'WORK';
					}[];
					urls: {
						url: string;
						type: 'HOME' | 'WORK';
					}[];
				}[];
		  }
		| {
				type: 'button';
				text: string;
				buttons: {
					id: string;
					text: string;
				}[];
		  }
		| {
				type: 'list';
				header: string;
				body: string;
				footer: string;
				button_text: string;
				sections: {
					title: string;
					buttons: {
						id: string;
						text: string;
					}[];
				}[];
		  }
		| {
				type: 'whatsapp_flow';
				header: string;
				body: string;
				footer: string;
				flow_id: string;
				button_text: string;
		  }
		| {
				type: 'template';
				template_id: string;
				template_name: string;
				template_header?: {
					type: 'IMAGE' | 'TEXT' | 'VIDEO' | 'DOCUMENT';
					text?: {
						custom_text: string;
						phonebook_data: string;
						variable_from: 'custom_text' | 'phonebook_data';
						fallback_value: string;
					}[];
					media_id?: string;
					link?: string;
				};
				template_body: {
					custom_text: string;
					phonebook_data: string;
					variable_from: 'custom_text' | 'phonebook_data';
					fallback_value: string;
				}[];
				template_buttons: string[][];
				template_carousel?: {
					cards: {
						header: {
							media_id: string;
						};
						body: {
							custom_text: string;
							phonebook_data: string;
							variable_from: 'custom_text' | 'phonebook_data';
							fallback_value: string;
						}[];
						buttons: string[][];
					}[];
				};
		  };
	recipient: string;
	context?: {
		message_id: string;
	};
};

export async function SendMessageValidator(req: Request, res: Response, next: NextFunction) {
	const textType = z.object({
		type: z.literal('text'),
		text: z.string().trim().trim().min(1),
	});

	const mediaType = z.object({
		type: z.enum(['image', 'video', 'document', 'audio']),
		media_id: z.string().trim().default(''),
		media_link: z.string().trim().default(''),
	});

	const locationType = z.object({
		type: z.literal('location'),
		location: z.object({
			latitude: z.string().trim().min(1),
			longitude: z.string().trim().min(1),
			name: z.string().trim().default(''),
			address: z.string().trim().default(''),
		}),
	});

	const contactsType = z.object({
		type: z.literal('contacts'),
		contacts: z
			.object({
				name: z.object({
					formatted_name: z.string().trim(),
					first_name: z.string().trim(),
					last_name: z.string().trim(),
					middle_name: z.string().trim(),
					suffix: z.string().trim(),
					prefix: z.string().trim(),
				}),
				addresses: z.array(
					z.object({
						street: z.string().trim(),
						city: z.string().trim(),
						state: z.string().trim(),
						zip: z.string().trim(),
						country: z.string().trim(),
						country_code: z.string().trim(),
						type: z.enum(['HOME', 'WORK']).default('HOME'),
					})
				),
				birthday: z.string().trim(),
				emails: z.array(
					z.object({
						email: z.string().trim(),
						type: z.enum(['WORK', 'HOME']).default('HOME'),
					})
				),
				org: z.object({
					company: z.string().trim(),
					department: z.string().trim(),
					title: z.string().trim(),
				}),
				phones: z.array(
					z.object({
						phone: z.string().trim(),
						wa_id: z.string().trim(),
						type: z.enum(['HOME', 'WORK']).default('HOME'),
					})
				),
				urls: z.array(
					z.object({
						url: z.string().trim(),
						type: z.enum(['HOME', 'WORK']).default('HOME'),
					})
				),
			})
			.array(),
	});

	const buttonType = z.object({
		type: z.literal('button'),
		text: z.string().trim().trim().min(1),
		buttons: z.array(
			z.object({
				id: z
					.string()
					.trim()
					.trim()
					.min(1)
					.refine((val) => val.match(/^[a-z]+$/), {
						message: 'Button ID must be lowercase alphabets only.',
					}),
				text: z.string().trim().trim().min(1),
			})
		),
	});

	const listType = z.object({
		type: z.literal('list'),
		header: z.string().trim().trim().optional(),
		body: z.string().trim().trim().min(1),
		footer: z.string().trim().trim().optional(),
		button_text: z.string().trim().trim().min(1),
		sections: z.array(
			z.object({
				title: z.string().trim().trim().min(1),
				buttons: z.array(
					z.object({
						id: z
							.string()
							.trim()
							.trim()
							.min(1)
							.refine((val) => val.match(/^[a-z]+$/), {
								message: 'Button ID must be lowercase alphabets only.',
							}),
						text: z.string().trim().trim().min(1),
					})
				),
			})
		),
	});

	const flowType = z.object({
		type: z.literal('whatsapp_flow'),
		header: z.string().trim().trim().optional(),
		body: z.string().trim().trim().min(1),
		footer: z.string().trim().trim().optional(),
		flow_id: z.string().trim().trim().min(1),
		button_text: z.string().trim().trim().min(1),
	});

	const templateType = z.object({
		type: z.literal('template'),
		template_id: z.string().trim().trim().min(1),
		template_name: z.string().trim().trim().min(1),
		template_header: z
			.object({
				type: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT']).optional(),
				text: z
					.array(
						z.object({
							custom_text: z.string().trim(),
							phonebook_data: z.string().trim(),
							variable_from: z.enum(['custom_text', 'phonebook_data']),
							fallback_value: z.string().trim(),
						})
					)
					.optional(),
				media_id: z.string().trim().optional(),
				link: z.string().trim().optional(),
			})
			.optional(),
		template_body: z
			.array(
				z.object({
					custom_text: z.string().trim(),
					phonebook_data: z.string().trim(),
					variable_from: z.enum(['custom_text', 'phonebook_data']),
					fallback_value: z.string().trim(),
				})
			)
			.default([]),
		template_buttons: z.array(z.array(z.string().trim())).default([]),
		template_carousel: z
			.object({
				cards: z.array(
					z.object({
						header: z.object({
							media_id: z.string().trim(),
						}),
						body: z
							.array(
								z.object({
									custom_text: z.string().trim(),
									phonebook_data: z.string().trim(),
									variable_from: z.enum(['custom_text', 'phonebook_data']),
									fallback_value: z.string().trim(),
								})
							)
							.default([]),
						buttons: z.array(z.array(z.string().trim())).default([]),
					})
				),
			})
			.optional(),
	});

	const reqValidator = z.object({
		recipient: z.string().trim().min(1, 'Please provide a valid phone number.'),
		message: z
			.discriminatedUnion('type', [
				textType,
				mediaType,
				locationType,
				contactsType,
				buttonType,
				listType,
				flowType,
				templateType,
			])
			.superRefine((data, ctx) => {
				if (
					data.type === 'document' ||
					data.type === 'audio' ||
					data.type === 'video' ||
					data.type === 'image'
				)
					if (!data.media_id && !data.media_link) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: "Please provide either 'media_id' or 'media_link'.",
						});
					}
			}),
		context: z
			.object({
				message_id: z.string().trim(),
			})
			.optional(),
	});

	const reqValidatorResult = reqValidator.safeParse(req.body);

	if (reqValidatorResult.success) {
		req.locals.data = reqValidatorResult.data;
		return next();
	}

	return next(
		new CustomError({
			STATUS: 400,
			TITLE: 'INVALID_FIELDS',
			MESSAGE: "Invalid fields in the request's body.",
			OBJECT: reqValidatorResult.error.flatten(),
		})
	);
}
