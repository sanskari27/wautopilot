import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { z } from 'zod';
import { BOT_TRIGGER_OPTIONS } from '../../config/const';
import { CustomError } from '../../errors';
import { idsArray } from '../../utils/schema';

export type CreateBotValidationResult = {
	trigger: string[];
	trigger_gap_seconds: number;
	response_delay_seconds: number;
	options: BOT_TRIGGER_OPTIONS;
	startAt: string;
	endAt: string;
	respond_type: 'template' | 'normal';
	message: string;
	images: Types.ObjectId[];
	videos: Types.ObjectId[];
	audios: Types.ObjectId[];
	documents: Types.ObjectId[];
	contacts: Types.ObjectId[];
	template_id: string;
	template_name: string;
	template_body: {
		custom_text: string;
		phonebook_data: string;
		variable_from: 'custom_text' | 'phonebook_data';
		fallback_value: string;
	}[];
	template_header?: {
		type?: 'IMAGE' | 'TEXT' | 'VIDEO' | 'DOCUMENT';
		link?: string | undefined;
		media_id?: string | undefined;
	};
	nurturing: {
		after: number;
		start_from: string;
		end_at: string;
		template_id: string;
		template_name: string;
		template_body: {
			custom_text: string;
			phonebook_data: string;
			variable_from: 'custom_text' | 'phonebook_data';
			fallback_value: string;
		}[];
		template_header?: {
			type: 'IMAGE' | 'TEXT' | 'VIDEO' | 'DOCUMENT';
			link?: string | undefined;
			media_id?: string | undefined;
		};
	}[];
};

export type CreateFlowValidationResult = {
	name: string;
	options: BOT_TRIGGER_OPTIONS;
	trigger: string[];
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
			media_id?: string;
			link?: string;
		};
		template_body: {
			custom_text: string;
			phonebook_data: string;
			variable_from: 'custom_text' | 'phonebook_data';
			fallback_value: string;
		}[];
	}[];
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

export async function CreateBotValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		trigger: z.array(z.string().min(1)).default([]),
		trigger_gap_seconds: z.number().positive().default(1),
		response_delay_seconds: z.number().nonnegative().default(0),
		options: z.enum([
			BOT_TRIGGER_OPTIONS.EXACT_IGNORE_CASE,
			BOT_TRIGGER_OPTIONS.EXACT_MATCH_CASE,
			BOT_TRIGGER_OPTIONS.INCLUDES_IGNORE_CASE,
			BOT_TRIGGER_OPTIONS.INCLUDES_MATCH_CASE,
		]),
		startAt: z.string().default('00:01'),
		endAt: z.string().default('23:59'),

		respond_type: z.enum(['template', 'normal']),
		message: z.string().trim().default(''),
		images: idsArray.default([]),
		videos: idsArray.default([]),
		audios: idsArray.default([]),
		documents: idsArray.default([]),
		contacts: idsArray.default([]),

		template_id: z.string().default(''),
		template_name: z.string().default(''),
		template_header: z
			.object({
				type: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT']).optional(),
				media_id: z.string().optional(),
				link: z.string().optional(),
			})
			.optional(),
		template_body: z
			.array(
				z.object({
					custom_text: z.string(),
					phonebook_data: z.string(),
					variable_from: z.enum(['custom_text', 'phonebook_data']),
					fallback_value: z.string(),
				})
			)
			.default([]),

		nurturing: z
			.object({
				after: z.number(),
				start_from: z.string().trim().default('00:01'),
				end_at: z.string().trim().default('23:59'),
				template_id: z.string().default(''),
				template_name: z.string().default(''),
				template_header: z
					.object({
						type: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT']),
						media_id: z.string().optional(),
						link: z.string().optional(),
					})
					.optional(),
				template_body: z
					.array(
						z.object({
							custom_text: z.string(),
							phonebook_data: z.string(),
							variable_from: z.enum(['custom_text', 'phonebook_data']),
							fallback_value: z.string(),
						})
					)
					.default([]),
			})
			.array()
			.default([]),
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

export async function CreateFlowValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		trigger: z.array(z.string().min(1)).default([]),
		options: z.enum([
			BOT_TRIGGER_OPTIONS.EXACT_IGNORE_CASE,
			BOT_TRIGGER_OPTIONS.EXACT_MATCH_CASE,
			BOT_TRIGGER_OPTIONS.INCLUDES_IGNORE_CASE,
			BOT_TRIGGER_OPTIONS.INCLUDES_MATCH_CASE,
		]),

		name: z.string(),
		nodes: z
			.array(
				z.object({
					id: z.string(),
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
						'endNode',
					]),
				})
			)
			.default([]),
		edges: z
			.array(
				z.object({
					id: z.string(),
					source: z.string(),
					target: z.string(),
					animated: z.boolean().default(true),
					style: z
						.object({
							stroke: z.string().default('#000'),
						})
						.optional(),
					sourceHandle: z.string().or(z.null()).optional(),
					targetHandle: z.string().or(z.null()).optional(),
				})
			)
			.default([]),

		nurturing: z
			.array(
				z.object({
					after: z.number().min(1),
					respond_type: z.enum(['template', 'normal']).default('normal'),
					message: z.string().default(''),
					images: idsArray.default([]),
					videos: idsArray.default([]),
					audios: idsArray.default([]),
					documents: idsArray.default([]),
					contacts: idsArray.default([]),
					template_id: z.string().default(''),
					template_name: z.string().default(''),
					template_header: z
						.object({
							type: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT']),
							media_id: z.string().optional(),
						})
						.optional(),
					template_body: z
						.array(
							z.object({
								custom_text: z.string(),
								phonebook_data: z.string(),
								variable_from: z.enum(['custom_text', 'phonebook_data']),
								fallback_value: z.string(),
							})
						)
						.default([]),
				})
			)
			.default([]),
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

export async function UpdateFlowValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		trigger: z.string().optional(),
		options: z
			.enum([
				BOT_TRIGGER_OPTIONS.EXACT_IGNORE_CASE,
				BOT_TRIGGER_OPTIONS.EXACT_MATCH_CASE,
				BOT_TRIGGER_OPTIONS.INCLUDES_IGNORE_CASE,
				BOT_TRIGGER_OPTIONS.INCLUDES_MATCH_CASE,
			])
			.optional(),

		name: z.string().optional(),
		nodes: z
			.array(
				z.object({
					id: z.string(),
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
						'endNode',
					]),
				})
			)
			.optional(),
		edges: z
			.array(
				z.object({
					id: z.string(),
					source: z.string(),
					target: z.string(),
					animated: z.boolean().default(true),
					style: z
						.object({
							stroke: z.string().default('#000'),
						})
						.optional(),
					sourceHandle: z.string().or(z.null()).optional(),
					targetHandle: z.string().or(z.null()).optional(),
				})
			)
			.optional(),
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

export async function WhatsappFlowValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		name: z.string().min(1),
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

export async function UpdateWhatsappFlowValidator(req: Request, res: Response, next: NextFunction) {
	const textType = z.object({
		type: z.enum(['TextBody', 'TextCaption', 'TextSubheading', 'TextHeading']),
		text: z.string(),
	});

	const imageType = z.object({
		type: z.literal('Image'),
		src: z.string(),
		height: z.number().default(300),
		'scale-type': z.literal('contain'),
	});

	const inputType = z.object({
		type: z.literal('TextInput'),
		name: z.string(),
		label: z.string(),
		required: z.boolean(),
		'input-type': z.enum(['text', 'number', 'email', 'number', 'password', 'phone']),
		'helper-text': z.string().optional(),
	});

	const textAreaType = z.object({
		type: z.enum(['TextArea', 'DatePicker']),
		name: z.string(),
		label: z.string(),
		required: z.boolean(),
		'helper-text': z.string().optional(),
	});

	const selectType = z.object({
		type: z.enum(['RadioButtonsGroup', 'CheckboxGroup', 'Dropdown']),
		name: z.string(),
		label: z.string(),
		required: z.boolean(),
		'data-source': z.array(z.string()).min(1),
	});

	const optInType = z.object({
		type: z.literal('OptIn'),
		name: z.string(),
		label: z.string(),
		required: z.boolean(),
	});

	const footerType = z.object({
		type: z.literal('Footer'),
		label: z.string(),
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
					title: z.string(),
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
