import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../../errors';
import COMMON_ERRORS from '../../errors/common-errors';
import TemplateService from '../../services/templates';
import { Template } from '../../types/template';
import { Respond } from '../../utils/ExpressUtils';
import { TemplateRemoveValidationResult } from './template.validator';

async function addTemplate(req: Request, res: Response, next: NextFunction) {
	const {
		serviceAccount: account,
		device: { device },
		agentLogService,
		data,
	} = req.locals;

	try {
		const templateService = new TemplateService(account, device);
		const success = await templateService.addTemplate(data as Template);

		if (!success) {
			return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR));
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
		serviceAccount: account,
		device: { device },
		agentLogService,
	} = req.locals;

	try {
		const { id, ...data } = req.locals.data as Template & { id: string };

		const templateService = new TemplateService(account, device);
		const success = await templateService.editTemplate(id, data);

		if (!success) {
			return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR));
		}

		agentLogService?.addLog({
			text: `Update template with name ${data.name}`,
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

async function deleteTemplate(req: Request, res: Response, next: NextFunction) {
	const { id, name } = req.locals.data as TemplateRemoveValidationResult;
	const {
		serviceAccount: account,
		device: { device },
		agentLogService,
	} = req.locals;

	try {
		const templateService = new TemplateService(account, device);
		const success = await templateService.deleteTemplate(id, name);

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
		serviceAccount: account,
		device: { device },
	} = req.locals;
	try {
		const templateService = new TemplateService(account, device);
		const templates = await templateService.fetchTemplates();

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
		serviceAccount: account,
		device: { device },
	} = req.locals;
	try {
		const templateService = new TemplateService(account, device);
		const template = await templateService.fetchTemplate(id);

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
