import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../../../errors';
import COMMON_ERRORS from '../../../errors/common-errors';
import WhatsappFlowService from '../../../services/wa_flow';
import { Respond } from '../../../utils/ExpressUtils';

async function listWhatsappFlows(req: Request, res: Response, next: NextFunction) {
	const {
		serviceAccount: account,
		device: { device },
	} = req.locals;

	const flows = await new WhatsappFlowService(account, device).listFlows();

	return Respond({
		res,
		status: 200,
		data: {
			flows,
		},
	});
}

async function getWhatsappFlowAssets(req: Request, res: Response, next: NextFunction) {
	const {
		device: { device },
		serviceAccount: account,
	} = req.locals;
	const id = req.params.id;

	if (!id) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
	try {
		const screens = await new WhatsappFlowService(account, device).getWhatsappFlowContents(id);
		return Respond({
			res,
			status: 200,
			data: {
				screens,
			},
		});
	} catch (e) {
		if (e instanceof CustomError) {
			return next(e);
		} else {
			return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR));
		}
	}
}

const Controller = {
	listWhatsappFlows,
	getWhatsappFlowAssets,
};

export default Controller;
