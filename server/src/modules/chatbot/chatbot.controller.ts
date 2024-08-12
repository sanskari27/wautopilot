import { NextFunction, Request, Response } from 'express';
import { WhatsappFlowResponseDB } from '../../../mongo/repo';
import IWhatsappFlowResponse from '../../../mongo/types/whatsappFlowResponse';
import { CustomError } from '../../errors';
import COMMON_ERRORS from '../../errors/common-errors';
import ChatBotService from '../../services/chatbot';
import CSVHelper from '../../utils/CSVHelper';
import { Respond, RespondCSV } from '../../utils/ExpressUtils';
import {
	CreateBotValidationResult,
	CreateFlowValidationResult,
	UpdateFlowValidationResult,
	UpdateWhatsappFlowValidationResult,
	WhatsappFlowValidationResult,
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
		id,
	} = req.locals;
	try {
		const details = await new ChatBotService(account, device).chatBotFlowDetails(id);

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

async function exportWhatsappFlow(req: Request, res: Response, next: NextFunction) {
	const { serviceAccount: account } = req.locals;

	const docs = await WhatsappFlowResponseDB.find({
		linked_to: account._id,
	}).sort({
		'data.flow_token': 1,
		received_at: -1,
	});

	const parsableData = docs.map((doc) => {
		const data = doc.toObject() as IWhatsappFlowResponse;
		return {
			recipient: data.recipient,
			recipient_name: data.recipient_name,
			received_at: data.received_at,
			...data.data,
		};
	});

	return RespondCSV({
		res,
		filename: 'whatsapp-flow-responses.csv',
		data: CSVHelper.exportWhatsappFlowResponse(parsableData),
	});
}

async function listWhatsappFlows(req: Request, res: Response, next: NextFunction) {
	const {
		serviceAccount: account,
		device: { device },
	} = req.locals;

	const flows = await new ChatBotService(account, device).listWhatsappFlows();

	return Respond({
		res,
		status: 200,
		data: {
			flows,
		},
	});
}

async function createWhatsappFlow(req: Request, res: Response, next: NextFunction) {
	const {
		device: { device },
		agentLogService,
		serviceAccount: account,
	} = req.locals;
	const data = req.locals.data as WhatsappFlowValidationResult;

	const id = await new ChatBotService(account, device).createWhatsappFlow(data);

	if (!id) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}

	agentLogService?.addLog({
		text: `Create whatsapp flow with id ${id}`,
		data: {
			id: id,
		},
	});

	return Respond({
		res,
		status: 200,
		data: {
			id,
		},
	});
}

async function updateWhatsappFlow(req: Request, res: Response, next: NextFunction) {
	const {
		device: { device },
		agentLogService,
		serviceAccount: account,
	} = req.locals;
	const data = req.locals.data as WhatsappFlowValidationResult;
	const id = req.params.id;
	console.log(id);

	if (!id) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}

	const success = await new ChatBotService(account, device).updateWhatsappFlow(id, data);

	console.log(success);
	if (!success) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}

	agentLogService?.addLog({
		text: `Update whatsapp flow with id ${id}`,
		data: {
			id: id,
		},
	});

	return Respond({
		res,
		status: 200,
		data: {
			id,
		},
	});
}

async function publishWhatsappFlow(req: Request, res: Response, next: NextFunction) {
	const {
		device: { device },
		agentLogService,
		serviceAccount: account,
	} = req.locals;
	const id = req.params.id;

	if (!id) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}

	const success = await new ChatBotService(account, device).publishWhatsappFlow(id);

	if (!success) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}

	agentLogService?.addLog({
		text: `Publish whatsapp flow with id ${id}`,
		data: {
			id: id,
		},
	});

	return Respond({
		res,
		status: 200,
		data: {
			id,
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
		const screens = await new ChatBotService(account, device).getWhatsappFlowContents(id);
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

async function deleteWhatsappFlow(req: Request, res: Response, next: NextFunction) {
	const {
		device: { device },
		agentLogService,
		serviceAccount: account,
	} = req.locals;
	const id = req.params.id;

	if (!id) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}

	const success = await new ChatBotService(account, device).deleteWhatsappFlow(id);

	if (!success) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}

	agentLogService?.addLog({
		text: `Delete whatsapp flow with id ${id}`,
		data: {
			id: id,
		},
	});

	return Respond({
		res,
		status: 200,
		data: {
			id,
		},
	});
}

async function updateWhatsappFlowContents(req: Request, res: Response, next: NextFunction) {
	const {
		device: { device },
		agentLogService,
		serviceAccount: account,
	} = req.locals;
	const data = req.locals.data as UpdateWhatsappFlowValidationResult;
	const id = req.params.id;

	if (!id) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}

	try {
		await new ChatBotService(account, device).updateWhatsappFlowContents(id, data);
	} catch (e) {
		return next(e);
	}

	agentLogService?.addLog({
		text: `Update whatsapp flow with id ${id}`,
		data: {
			id: id,
		},
	});

	return Respond({
		res,
		status: 200,
		data: {
			id,
		},
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
	exportWhatsappFlow,
	listWhatsappFlows,
	createWhatsappFlow,
	updateWhatsappFlow,
	updateWhatsappFlowContents,
	deleteWhatsappFlow,
	getWhatsappFlowAssets,
	publishWhatsappFlow,
};

export default Controller;
