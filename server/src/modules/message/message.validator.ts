import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { CustomError } from '../../errors';

export type SendTemplateMessageValidationResult = {
	template_name: string;
	to: string[];
	components: (
		| {
				type: 'HEADER';
				parameters:
					| {
							type: 'text';
							text: string;
					  }
					| {
							type: 'image';
							image: {
								link: string;
							};
					  };
		  }
		| {
				type: 'BODY';
				parameters: {
					type: 'text';
					text: string;
				}[];
		  }
	)[];
};

export async function SendTemplateMessage(req: Request, res: Response, next: NextFunction) {
	const textSchema = z.object({
		type: z.literal('text'),
		text: z.string(),
	});

	const imageHeaderSchema = z.object({
		type: z.literal('image'),
		image: z.object({
			link: z.string(),
		}),
	});

	const headerParameterSchema = z.discriminatedUnion('type', [textSchema, imageHeaderSchema]);

	const headerSchema = z.object({
		type: z.literal('HEADER'),
		parameters: z.array(headerParameterSchema),
	});

	const bodySchema = z.object({
		type: z.literal('BODY'),
		parameters: z.array(textSchema),
	});

	const componentSchema = z.discriminatedUnion('type', [headerSchema, bodySchema]);

	const reqValidator = z.object({
		template_name: z.string(),
		to: z.string().array(),
		components: z.array(componentSchema),
	});

	const reqValidatorResult = reqValidator.safeParse(req.body);

	if (reqValidatorResult.success) {
		req.locals.data = reqValidatorResult.data;
		return next();
	}
	const message = reqValidatorResult.error.issues
		.map((err) => err.path)
		.flat()
		.filter((item, pos, arr) => arr.indexOf(item) == pos)
		.join(', ');

	return next(
		new CustomError({
			STATUS: 400,
			TITLE: 'INVALID_FIELDS',
			MESSAGE: message,
		})
	);
}
