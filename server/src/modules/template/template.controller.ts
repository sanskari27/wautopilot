import { NextFunction, Request, Response } from 'express';
import { UserLevel } from '../../config/const';
import { CustomError } from '../../errors';
import COMMON_ERRORS from '../../errors/common-errors';
import TemplateService from '../../services/templates';
import { Template } from '../../types/template';
import { Respond } from '../../utils/ExpressUtils';
import { TemplateRemoveValidationResult } from './template.validator';

async function addTemplate(req: Request, res: Response, next: NextFunction) {
	const {
		user,
		serviceAccount: account,
		device: { device },
	} = req.locals;

	if (user.userLevel === UserLevel.Agent) {
		const permissions = await user.getPermissions();
		if (!permissions.create_template) {
			return next(new CustomError(COMMON_ERRORS.PERMISSION_DENIED));
		}
	}

	try {
		const templateService = new TemplateService(account, device);
		const success = await templateService.addTemplate(req.locals.data as Template);

		if (!success) {
			return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR));
		}

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
		user,
		serviceAccount: account,
		device: { device },
	} = req.locals;

	if (user.userLevel === UserLevel.Agent) {
		const permissions = await user.getPermissions();
		if (!permissions.create_template) {
			return next(new CustomError(COMMON_ERRORS.PERMISSION_DENIED));
		}
	}

	try {
		const { id, ...data } = req.locals.data as Template & { id: string };

		const templateService = new TemplateService(account, device);
		const success = await templateService.editTemplate(id, data);

		if (!success) {
			return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR));
		}

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
		user,
		serviceAccount: account,
		device: { device },
	} = req.locals;

	if (user.userLevel === UserLevel.Agent) {
		const permissions = await user.getPermissions();
		if (!permissions.create_template) {
			return next(new CustomError(COMMON_ERRORS.PERMISSION_DENIED));
		}
	}

	try {
		const templateService = new TemplateService(account, device);
		const success = await templateService.deleteTemplate(id, name);

		if (!success) {
			return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
		}

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
