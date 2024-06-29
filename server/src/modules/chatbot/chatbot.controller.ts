import { NextFunction, Request, Response } from 'express';
import ChatBotService from '../../services/chatbot';
import { Respond } from '../../utils/ExpressUtils';
import { CreateBotValidationResult } from './chatbot.validator';

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
			bots: list,
		},
	});
}

async function deleteBot(req: Request, res: Response, next: NextFunction) {
	const {
		account,
		device: { device },
		id,
	} = req.locals;

	const list = await new ChatBotService(account, device).deleteBot(id);
	return Respond({
		res,
		status: 200,
		data: {
			bots: list,
		},
	});
}

const Controller = {
	createBot,
	listBots,
	updateBot,
	toggleActive,
	deleteBot,
};

export default Controller;
