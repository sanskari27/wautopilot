import { NextFunction, Request, Response } from 'express';
import Logger from 'n23-logger';
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
				type: 'location';
				location: {
					latitude: string;
					longitude: string;
					name: string;
					address: string;
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
		text: z.string().trim().min(1),
	});

	const mediaType = z.object({
		type: z.enum(['image', 'video', 'document', 'audio']),
		media_id: z.string().default(''),
		media_link: z.string().default(''),
	});

	const locationType = z.object({
		type: z.literal('location'),
		location: z.object({
			latitude: z.string().min(1),
			longitude: z.string().min(1),
			name: z.string().default(''),
			address: z.string().default(''),
		}),
	});

	const contactsType = z.object({
		type: z.literal('contacts'),
		contacts: z
			.object({
				name: z.object({
					formatted_name: z.string(),
					first_name: z.string(),
					last_name: z.string(),
					middle_name: z.string(),
					suffix: z.string(),
					prefix: z.string(),
				}),
				addresses: z.array(
					z.object({
						street: z.string(),
						city: z.string(),
						state: z.string(),
						zip: z.string(),
						country: z.string(),
						country_code: z.string(),
						type: z.enum(['HOME', 'WORK']).default('HOME'),
					})
				),
				birthday: z.string(),
				emails: z.array(
					z.object({
						email: z.string(),
						type: z.enum(['WORK', 'HOME']).default('HOME'),
					})
				),
				org: z.object({
					company: z.string(),
					department: z.string(),
					title: z.string(),
				}),
				phones: z.array(
					z.object({
						phone: z.string(),
						wa_id: z.string(),
						type: z.enum(['HOME', 'WORK']).default('HOME'),
					})
				),
				urls: z.array(
					z.object({
						url: z.string(),
						type: z.enum(['HOME', 'WORK']).default('HOME'),
					})
				),
			})
			.array(),
	});

	// Example of creating a discriminated union

	const reqValidator = z.object({
		recipient: z.string().min(1, 'Please provide a valid phone number.'),
		message: z
			.discriminatedUnion('type', [textType, mediaType, locationType, contactsType])
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
				message_id: z.string(),
			})
			.optional(),
	});

	const reqValidatorResult = reqValidator.safeParse(req.body);

	if (reqValidatorResult.success) {
		req.locals.data = reqValidatorResult.data;
		return next();
	}

	Logger.debug(reqValidatorResult.error.format());

	return next(
		new CustomError({
			STATUS: 400,
			TITLE: 'INVALID_FIELDS',
			MESSAGE: "Invalid fields in the request's body.",
			OBJECT: reqValidatorResult.error.flatten(),
		})
	);
}
