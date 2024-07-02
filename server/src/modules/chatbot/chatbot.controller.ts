import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../../errors';
import COMMON_ERRORS from '../../errors/common-errors';
import ChatBotService from '../../services/chatbot';
import { Respond } from '../../utils/ExpressUtils';
import { CreateBotValidationResult, CreateFlowValidationResult } from './chatbot.validator';

async function createBot(req: Request, res: Response, next: NextFunction) {
	const {
		account,
		device: { device },
	} = req.locals;

	const data = req.locals.data as CreateBotValidationResult;

	const bot = await new ChatBotService(account, device).createBot(data);
	return Respond({
		res,
		status: 200,
		data: {
			bot,
		},
	});
}

async function updateBot(req: Request, res: Response, next: NextFunction) {
	const {
		account,
		device: { device },
		id,
	} = req.locals;

	const data = req.locals.data as CreateBotValidationResult;

	const bot = await new ChatBotService(account, device).modifyBot(id, data);
	return Respond({
		res,
		status: 200,
		data: {
			bot,
		},
	});
}

async function listBots(req: Request, res: Response, next: NextFunction) {
	const {
		account,
		device: { device },
	} = req.locals;

	const list = await new ChatBotService(account, device).allBots();

	return Respond({
		res,
		status: 200,
		data: {
			bots: list,
		},
	});
}

async function toggleActive(req: Request, res: Response, next: NextFunction) {
	const {
		account,
		device: { device },
		id,
	} = req.locals;

	const list = await new ChatBotService(account, device).toggleActive(id);
	return Respond({
		res,
		status: 200,
		data: {
			bot: list,
		},
	});
}

async function deleteBot(req: Request, res: Response, next: NextFunction) {
	const {
		account,
		device: { device },
		id,
	} = req.locals;

	await new ChatBotService(account, device).deleteBot(id);
	return Respond({
		res,
		status: 200,
	});
}

async function createFlow(req: Request, res: Response, next: NextFunction) {
	const {
		account,
		device: { device },
	} = req.locals;

	const data = req.locals.data as CreateFlowValidationResult;

	const flow = await new ChatBotService(account, device).createFlow(data);
	return Respond({
		res,
		status: 200,
		data: {
			flow,
		},
	});
}

async function updateFlow(req: Request, res: Response, next: NextFunction) {
	const {
		account,
		device: { device },
		id,
	} = req.locals;

	const data = req.locals.data as CreateFlowValidationResult;

	const bot = await new ChatBotService(account, device).modifyFlow(id, data);
	return Respond({
		res,
		status: 200,
		data: {
			bot,
		},
	});
}

async function listFlows(req: Request, res: Response, next: NextFunction) {
	const {
		account,
		device: { device },
	} = req.locals;

	const list = await new ChatBotService(account, device).allFlows();

	return Respond({
		res,
		status: 200,
		data: {
			flows: list,
		},
	});
}

async function chatBotFlowDetails(req: Request, res: Response, next: NextFunction) {
	const {
		account,
		device: { device },
	} = req.locals;
	try {
		const details = await new ChatBotService(account, device).chatBotFlowDetails(req.locals.id);

		return Respond({
			res,
			status: 200,
			data: {
				bot: details,
			},
		});
	} catch (e) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function toggleActiveFlow(req: Request, res: Response, next: NextFunction) {
	const {
		account,
		device: { device },
		id,
	} = req.locals;

	const list = await new ChatBotService(account, device).toggleActiveFlow(id);
	return Respond({
		res,
		status: 200,
		data: {
			bot: list,
		},
	});
}

async function deleteFlow(req: Request, res: Response, next: NextFunction) {
	const {
		account,
		device: { device },
		id,
	} = req.locals;

	await new ChatBotService(account, device).deleteFlow(id);
	return Respond({
		res,
		status: 200,
	});
}

const Controller = {
	createBot,
	listBots,
	updateBot,
	toggleActive,
	deleteBot,
	createFlow,
	updateFlow,
	toggleActiveFlow,
	deleteFlow,
	listFlows,
	chatBotFlowDetails,
};

export default Controller;
