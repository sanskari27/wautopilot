import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { z } from 'zod';
import { BOT_TRIGGER_OPTIONS } from '../../config/const';
import { CustomError } from '../../errors';
import { idsArray } from '../../utils/schema';

export type CreateFlowValidationResult = {
	name: string;
	options: BOT_TRIGGER_OPTIONS;
	trigger: string[];
	startAt: string;
	endAt: string;
	trigger_gap_seconds: number;
	nodes: {
		type:
			| 'startNode'
			| 'textNode'
			| 'imageNode'
			| 'audioNode'
			| 'videoNode'
			| 'documentNode'
			| 'buttonNode'
			| 'listNode'
			| 'flowNode'
			| 'contactNode'
			| 'templateNode'
			| 'locationRequestNode'
			| 'assignLabelNode'
			| 'endNode';
		id: string;
		position: {
			x: number;
			y: number;
		};
		measured: {
			height: number;
			width: number;
		};
		data?: any;
	}[];
	edges: {
		id: string;
		source: string;
		target: string;
		animated: boolean;
		style?: {
			stroke: string;
		};
		sourceHandle?: string;
		targetHandle?: string;
	}[];
	nurturing: {
		after: number;
		respond_type: 'template' | 'normal';
		message: string;
		images: Types.ObjectId[];
		videos: Types.ObjectId[];
		audios: Types.ObjectId[];
		documents: Types.ObjectId[];
		contacts: Types.ObjectId[];
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
	}[];
	forward: { number: string; message: string };
};

export type UpdateFlowValidationResult = Partial<CreateFlowValidationResult>;

export type WhatsappFlowValidationResult = {
	name: string;
	categories: (
		| 'SIGN_UP'
		| 'SIGN_IN'
		| 'APPOINTMENT_BOOKING'
		| 'LEAD_GENERATION'
		| 'CONTACT_US'
		| 'CUSTOMER_SUPPORT'
		| 'SURVEY'
		| 'OTHER'
	)[];
};

export type UpdateWhatsappFlowValidationResult = {
	screens: {
		title: string;
		children: (
			| {
					type: 'TextBody' | 'TextCaption' | 'TextSubheading' | 'TextHeading';
					text: string;
			  }
			| {
					type: 'Image';
					height: number;
					src: string;
					'scale-type': 'contain';
			  }
			| {
					type: 'TextInput';
					name: string;
					label: string;
					required: boolean;
					'input-type': 'number' | 'text' | 'email' | 'password' | 'phone';
					'helper-text'?: string | undefined;
			  }
			| {
					type: 'TextArea' | 'DatePicker';
					name: string;
					label: string;
					required: boolean;
					'helper-text'?: string | undefined;
			  }
			| {
					type: 'RadioButtonsGroup' | 'CheckboxGroup' | 'Dropdown';
					name: string;
					label: string;
					required: boolean;
					'data-source': string[];
			  }
			| {
					type: 'OptIn';
					name: string;
					label: string;
					required: boolean;
			  }
			| {
					type: 'Footer';
					label: string;
			  }
		)[];
	}[];
};

export async function CreateFlowValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		trigger: z.array(z.string().trim().min(1)).default([]),
		options: z.enum([
			BOT_TRIGGER_OPTIONS.EXACT_IGNORE_CASE,
			BOT_TRIGGER_OPTIONS.EXACT_MATCH_CASE,
			BOT_TRIGGER_OPTIONS.INCLUDES_IGNORE_CASE,
			BOT_TRIGGER_OPTIONS.INCLUDES_MATCH_CASE,
		]),

		name: z.string().trim(),
		startAt: z.string().trim().default('10:00'),
		endAt: z.string().trim().default('18:00'),
		trigger_gap_seconds: z.number().default(0),
		nodes: z
			.array(
				z.object({
					id: z.string().trim(),
					data: z.any().optional(),
					position: z.object({
						x: z.number(),
						y: z.number(),
					}),
					measured: z.object({
						height: z.number(),
						width: z.number(),
					}),
					type: z.enum([
						'startNode',
						'textNode',
						'imageNode',
						'audioNode',
						'videoNode',
						'documentNode',
						'buttonNode',
						'listNode',
						'flowNode',
						'contactNode',
						'templateNode',
						'locationRequestNode',
						'assignLabelNode',
						'endNode',
					]),
				})
			)
			.default([]),
		edges: z
			.array(
				z.object({
					id: z.string().trim(),
					source: z.string().trim(),
					target: z.string().trim(),
					animated: z.boolean().default(true),
					style: z
						.object({
							stroke: z.string().trim().default('#000'),
						})
						.optional(),
					sourceHandle: z.string().trim().or(z.null()).optional(),
					targetHandle: z.string().trim().or(z.null()).optional(),
				})
			)
			.default([]),

		nurturing: z
			.array(
				z.object({
					after: z.number().min(1),
					respond_type: z.enum(['template', 'normal']).default('normal'),
					message: z.string().trim().default(''),
					images: idsArray.default([]),
					videos: idsArray.default([]),
					audios: idsArray.default([]),
					documents: idsArray.default([]),
					contacts: idsArray.default([]),
					template_id: z.string().trim().default(''),
					template_name: z.string().trim().default(''),
					template_header: z
						.object({
							type: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT']),
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
				})
			)
			.default([]),
		forward: z.object({
			number: z.string().trim().default(''),
			message: z.string().trim().default(''),
		}),
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

export async function UpdateFlowValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		trigger: z.array(z.string().trim().min(1)).optional(),
		options: z
			.enum([
				BOT_TRIGGER_OPTIONS.EXACT_IGNORE_CASE,
				BOT_TRIGGER_OPTIONS.EXACT_MATCH_CASE,
				BOT_TRIGGER_OPTIONS.INCLUDES_IGNORE_CASE,
				BOT_TRIGGER_OPTIONS.INCLUDES_MATCH_CASE,
			])
			.optional(),

		name: z.string().trim().optional(),
		startAt: z.string().trim().optional(),
		endAt: z.string().trim().optional(),
		trigger_gap_seconds: z.number().optional(),
		nodes: z
			.array(
				z.object({
					id: z.string().trim(),
					data: z.any().optional(),
					position: z.object({
						x: z.number(),
						y: z.number(),
					}),
					measured: z.object({
						height: z.number(),
						width: z.number(),
					}),
					type: z.enum([
						'startNode',
						'textNode',
						'imageNode',
						'audioNode',
						'videoNode',
						'documentNode',
						'buttonNode',
						'listNode',
						'flowNode',
						'contactNode',
						'templateNode',
						'locationRequestNode',
						'assignLabelNode',
						'endNode',
					]),
				})
			)
			.optional(),
		edges: z
			.array(
				z.object({
					id: z.string().trim(),
					source: z.string().trim(),
					target: z.string().trim(),
					animated: z.boolean().default(true),
					style: z
						.object({
							stroke: z.string().trim().default('#000'),
						})
						.optional(),
					sourceHandle: z.string().trim().or(z.null()).optional(),
					targetHandle: z.string().trim().or(z.null()).optional(),
				})
			)
			.optional(),

		nurturing: z
			.array(
				z.object({
					after: z.number().min(1),
					respond_type: z.enum(['template', 'normal']).default('normal'),
					message: z.string().trim().default(''),
					images: idsArray.default([]),
					videos: idsArray.default([]),
					audios: idsArray.default([]),
					documents: idsArray.default([]),
					contacts: idsArray.default([]),
					template_id: z.string().trim().default(''),
					template_name: z.string().trim().default(''),
					template_header: z
						.object({
							type: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT']),
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
				})
			)
			.optional(),
		forward: z
			.object({
				number: z.string().trim().default(''),
				message: z.string().trim().default(''),
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

export async function WhatsappFlowValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		name: z.string().trim().min(1),
		categories: z.array(
			z.enum([
				'SIGN_UP',
				'SIGN_IN',
				'APPOINTMENT_BOOKING',
				'LEAD_GENERATION',
				'CONTACT_US',
				'CUSTOMER_SUPPORT',
				'SURVEY',
				'OTHER',
			])
		),
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

export async function UpdateWhatsappFlowValidator(req: Request, res: Response, next: NextFunction) {
	const textType = z.object({
		type: z.enum(['TextBody', 'TextCaption', 'TextSubheading', 'TextHeading']),
		text: z.string().trim(),
	});

	const imageType = z.object({
		type: z.literal('Image'),
		src: z.string().trim(),
		height: z.number().default(300),
		'scale-type': z.literal('contain'),
	});

	const inputType = z.object({
		type: z.literal('TextInput'),
		name: z.string().trim(),
		label: z.string().trim(),
		required: z.boolean(),
		'input-type': z.enum(['text', 'number', 'email', 'number', 'password', 'phone']),
		'helper-text': z.string().trim().optional(),
	});

	const textAreaType = z.object({
		type: z.enum(['TextArea', 'DatePicker']),
		name: z.string().trim(),
		label: z.string().trim(),
		required: z.boolean(),
		'helper-text': z.string().trim().optional(),
	});

	const selectType = z.object({
		type: z.enum(['RadioButtonsGroup', 'CheckboxGroup', 'Dropdown']),
		name: z.string().trim(),
		label: z.string().trim(),
		required: z.boolean(),
		'data-source': z.array(z.string().trim()).min(1),
	});

	const optInType = z.object({
		type: z.literal('OptIn'),
		name: z.string().trim(),
		label: z.string().trim(),
		required: z.boolean(),
	});

	const footerType = z.object({
		type: z.literal('Footer'),
		label: z.string().trim(),
	});

	const types = z.discriminatedUnion('type', [
		textType,
		imageType,
		inputType,
		textAreaType,
		selectType,
		optInType,
		footerType,
	]);

	const reqValidator = z.object({
		screens: z
			.array(
				z.object({
					title: z.string().trim(),
					children: z.array(types),
				})
			)
			.min(1),
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
