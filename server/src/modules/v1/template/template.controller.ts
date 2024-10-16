import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../../../errors';
import COMMON_ERRORS from '../../../errors/common-errors';
import Template from '../../../models/templates/template';
import TemplateFactory from '../../../models/templates/templateFactory';
import { Respond } from '../../../utils/ExpressUtils';

async function fetchTemplates(req: Request, res: Response, next: NextFunction) {
	const {
		device: { device },
	} = req.locals;
	try {
		const templates: Template[] = await TemplateFactory.find(device);

		return Respond({
			res,
			status: 200,
			data: {
				templates: templates.map((template) => template.getDetails()),
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
				template: template.buildToSave(),
			},
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

const Controller = {
	fetchTemplates,
	fetchTemplate,
};

export default Controller;
