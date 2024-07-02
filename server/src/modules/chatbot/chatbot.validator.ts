import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { z } from 'zod';
import { BOT_TRIGGER_OPTIONS, BOT_TRIGGER_TO } from '../../config/const';
import { CustomError } from '../../errors';

export type CreateBotValidationResult = {
	respond_to: BOT_TRIGGER_TO;
	trigger: string;
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
	group_respond: boolean;
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
	respond_to: BOT_TRIGGER_TO;
	trigger: string;
	nodes: {
		type:
			| 'startNode'
			| 'textNode'
			| 'imageNode'
			| 'audioNode'
			| 'videoNode'
			| 'documentNode'
			| 'buttonNode'
			| 'listNode';
		id: string;
		position: {
			x: number;
			y: number;
		};
		height: number;
		width: number;
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
};

export type UpdateFlowValidationResult = Partial<CreateFlowValidationResult>;

export async function CreateBotValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		respond_to: z.enum([
			BOT_TRIGGER_TO.ALL,
			BOT_TRIGGER_TO.SAVED_CONTACTS,
			BOT_TRIGGER_TO.NON_SAVED_CONTACTS,
		]),
		trigger: z.string().default(''),
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
		images: z
			.string()
			.array()
			.default([])
			.refine((ids) => !ids.some((value) => !Types.ObjectId.isValid(value)))
			.transform((ids) => ids.map((value) => new Types.ObjectId(value))),
		videos: z
			.string()
			.array()
			.default([])
			.refine((ids) => !ids.some((value) => !Types.ObjectId.isValid(value)))
			.transform((ids) => ids.map((value) => new Types.ObjectId(value))),
		audios: z
			.string()
			.array()
			.default([])
			.refine((ids) => !ids.some((value) => !Types.ObjectId.isValid(value)))
			.transform((ids) => ids.map((value) => new Types.ObjectId(value))),
		documents: z
			.string()
			.array()
			.default([])
			.refine((ids) => !ids.some((value) => !Types.ObjectId.isValid(value)))
			.transform((ids) => ids.map((value) => new Types.ObjectId(value))),
		contacts: z
			.string()
			.array()
			.default([])
			.refine((ids) => !ids.some((value) => !Types.ObjectId.isValid(value)))
			.transform((ids) => ids.map((value) => new Types.ObjectId(value))),

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

		group_respond: z.boolean().default(false),
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
		respond_to: z.enum([
			BOT_TRIGGER_TO.ALL,
			BOT_TRIGGER_TO.SAVED_CONTACTS,
			BOT_TRIGGER_TO.NON_SAVED_CONTACTS,
		]),
		trigger: z.string().default(''),
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
					height: z.number(),
					width: z.number(),
					type: z.enum([
						'startNode',
						'textNode',
						'imageNode',
						'audioNode',
						'videoNode',
						'documentNode',
						'buttonNode',
						'listNode',
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
		respond_to: z
			.enum([BOT_TRIGGER_TO.ALL, BOT_TRIGGER_TO.SAVED_CONTACTS, BOT_TRIGGER_TO.NON_SAVED_CONTACTS])
			.optional(),
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
					height: z.number(),
					width: z.number(),
					type: z.enum([
						'startNode',
						'textNode',
						'imageNode',
						'audioNode',
						'videoNode',
						'documentNode',
						'buttonNode',
						'listNode',
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
