import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../../errors';
import COMMON_ERRORS from '../../errors/common-errors';
import Template from '../../models/templates/template';
import TemplateFactory from '../../models/templates/templateFactory';
import { Respond } from '../../utils/ExpressUtils';
import { TemplateRemoveValidationResult } from './template.validator';

async function addTemplate(req: Request, res: Response, next: NextFunction) {
	const {
		device: { device },
		agentLogService,
		data,
	} = req.locals;

	try {
		const template = new Template(data);
		const error = await TemplateFactory.saveTemplate(device, template);

		if (error) {
			return Respond({
				res,
				status: 200,
				data: {
					error,
				},
			});
		}

		agentLogService?.addLog({
			text: `Create template with name ${data.name}`,
		});

		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function editTemplate(req: Request, res: Response, next: NextFunction) {
	const {
		device: { device },
		data,
		agentLogService,
	} = req.locals;

	try {
		const template = new Template(data);
		const error = await TemplateFactory.saveTemplate(device, template);

		if (error) {
			return Respond({
				res,
				status: 200,
				data: {
					error,
				},
			});
		}

		agentLogService?.addLog({
			text: `Edit template with name ${data.name}`,
		});

		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function deleteTemplate(req: Request, res: Response, next: NextFunction) {
	const { id, name } = req.locals.data as TemplateRemoveValidationResult;
	const {
		device: { device },
		agentLogService,
	} = req.locals;

	try {
		const success = await TemplateFactory.deleteTemplate(device, id, name);

		if (!success) {
			return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
		}

		agentLogService?.addLog({
			text: `Delete template with name ${name}`,
			data: {
				id,
			},
		});

		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}
async function fetchTemplates(req: Request, res: Response, next: NextFunction) {
	const {
		device: { device },
	} = req.locals;
	try {
		const templates = await TemplateFactory.find(device);

		return Respond({
			res,
			status: 200,
			data: {
				templates,
			},
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function fetchTemplate(req: Request, res: Response, next: NextFunction) {
	const id = req.params.id;
	const {
		device: { device },
	} = req.locals;
	try {
		const template = await TemplateFactory.findById(device, id);

		if (!template) {
			return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
		}

		return Respond({
			res,
			status: 200,
			data: {
				template,
			},
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

const Controller = {
	addTemplate,
	editTemplate,
	deleteTemplate,
	fetchTemplates,
	fetchTemplate,
};

export default Controller;
