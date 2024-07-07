import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../../errors';
import COMMON_ERRORS from '../../errors/common-errors';
import ChatBotService from '../../services/chatbot';
import CSVHelper from '../../utils/CSVHelper';
import { Respond, RespondCSV } from '../../utils/ExpressUtils';
import {
	CreateBotValidationResult,
	CreateFlowValidationResult,
	UpdateFlowValidationResult,
} from './chatbot.validator';

async function createBot(req: Request, res: Response, next: NextFunction) {
	const {
		serviceAccount: account,
		device: { device },
		agentLogService,
	} = req.locals;

	const data = req.locals.data as CreateBotValidationResult;

	const bot = await new ChatBotService(account, device).createBot(data);

	agentLogService?.addLog({
		text: `Create bot with trigger ${bot.trigger}`,
		data: {
			id: bot.bot_id,
		},
	});

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
		serviceAccount: account,
		device: { device },
		id,
		agentLogService,
	} = req.locals;

	const data = req.locals.data as CreateBotValidationResult;

	const bot = await new ChatBotService(account, device).modifyBot(id, data);

	agentLogService?.addLog({
		text: `Create bot with trigger ${bot.trigger}`,
		data: {
			id: bot.bot_id,
		},
	});
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
		serviceAccount: account,
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
		serviceAccount: account,
		device: { device },
		id,
		agentLogService,
	} = req.locals;

	const bot = await new ChatBotService(account, device).toggleActive(id);
	agentLogService?.addLog({
		text: `Create bot with trigger ${bot.trigger}`,
		data: {
			id: bot.bot_id,
		},
	});

	return Respond({
		res,
		status: 200,
		data: {
			bot: bot,
		},
	});
}

async function deleteBot(req: Request, res: Response, next: NextFunction) {
	const {
		serviceAccount: account,
		device: { device },
		id,
		agentLogService,
	} = req.locals;

	await new ChatBotService(account, device).deleteBot(id);

	agentLogService?.addLog({
		text: `Delete bot with id ${id}`,
		data: {
			id,
		},
	});

	return Respond({
		res,
		status: 200,
	});
}

async function downloadResponses(req: Request, res: Response, next: NextFunction) {
	const {
		serviceAccount: account,
		device: { device },
		id,
		agentLogService,
	} = req.locals;

	const responses = await new ChatBotService(account, device).botResponses(id);

	agentLogService?.addLog({
		text: `Download bot responses with id ${id}`,
		data: {
			id,
		},
	});

	return RespondCSV({
		res,
		filename: `responses-${id}.csv`,
		data: CSVHelper.exportChatbotReport(responses),
	});
}

async function createFlow(req: Request, res: Response, next: NextFunction) {
	const {
		serviceAccount: account,
		device: { device },
		agentLogService,
	} = req.locals;

	const data = req.locals.data as CreateFlowValidationResult;

	const flow = await new ChatBotService(account, device).createFlow(data);

	agentLogService?.addLog({
		text: `Create flow with id ${flow.bot_id}`,
		data: {
			id: flow.bot_id,
		},
	});

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
		serviceAccount: account,
		device: { device },
		id,
		agentLogService,
	} = req.locals;

	const data = req.locals.data as UpdateFlowValidationResult;

	const flow = await new ChatBotService(account, device).modifyFlow(id, data);

	agentLogService?.addLog({
		text: `Create flow with id ${flow.bot_id}`,
		data: {
			id: flow.bot_id,
		},
	});

	return Respond({
		res,
		status: 200,
		data: {
			flow,
		},
	});
}

async function listFlows(req: Request, res: Response, next: NextFunction) {
	const {
		serviceAccount: account,
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
		serviceAccount: account,
		device: { device },
	} = req.locals;
	try {
		const details = await new ChatBotService(account, device).chatBotFlowDetails(req.locals.id);

		return Respond({
			res,
			status: 200,
			data: {
				flow: details,
			},
		});
	} catch (e) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function toggleActiveFlow(req: Request, res: Response, next: NextFunction) {
	const {
		serviceAccount: account,
		device: { device },
		id,
		agentLogService,
	} = req.locals;

	const flow = await new ChatBotService(account, device).toggleActiveFlow(id);

	agentLogService?.addLog({
		text: `Create flow with id ${flow.bot_id}`,
		data: {
			id: flow.bot_id,
		},
	});

	return Respond({
		res,
		status: 200,
		data: {
			flow: flow,
		},
	});
}

async function deleteFlow(req: Request, res: Response, next: NextFunction) {
	const {
		serviceAccount: account,
		device: { device },
		id,
		agentLogService,
	} = req.locals;

	await new ChatBotService(account, device).deleteFlow(id);

	agentLogService?.addLog({
		text: `Delete flow with id ${id}`,
		data: {
			id,
		},
	});

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
	downloadResponses,
	chatBotFlowDetails,
};

export default Controller;
