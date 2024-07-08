import { NextFunction, Request, Response } from 'express';
import { QuickReplyDB } from '../../../mongo';
import { UserLevel } from '../../config/const';
import { AUTH_ERRORS, CustomError } from '../../errors';
import COMMON_ERRORS from '../../errors/common-errors';
import { UserService } from '../../services';
import AgentLogService from '../../services/agentLogs';
import TaskService from '../../services/task';
import { Respond } from '../../utils/ExpressUtils';
import {
	AssignTaskValidationResult,
	CreateAgentValidationResult,
	PasswordValidationResult,
	PermissionsValidationResult,
	UpgradePlanValidationResult,
} from './users.validator';
export const JWT_EXPIRE_TIME = 3 * 60 * 1000;
export const SESSION_EXPIRE_TIME = 28 * 24 * 60 * 60 * 1000;

async function getAdmins(req: Request, res: Response, next: NextFunction) {
	try {
		const users = await req.locals.user.getUsers();
		return Respond({
			res,
			status: 200,
			data: { users },
		});
	} catch (err) {
		if (err instanceof CustomError) return next(err);
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR));
	}
}

async function extendSubscription(req: Request, res: Response, next: NextFunction) {
	if (!req.body.date || typeof req.body.date !== 'string') {
		return next(new CustomError(COMMON_ERRORS.INVALID_FIELDS));
	}

	try {
		const userService = await UserService.findById(req.locals.id);
		await userService.extendSubscription(req.body.date as string);
		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		if (err instanceof CustomError) return next(err);
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR));
	}
}

async function upgradePlan(req: Request, res: Response, next: NextFunction) {
	const { date, plan_id } = req.locals.data as UpgradePlanValidationResult;

	try {
		const userService = await UserService.findById(req.locals.id);
		if (plan_id) {
			await userService.upgradePlan(plan_id, date);
		} else {
			await userService.removePlan();
		}
		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		if (err instanceof CustomError) return next(err);
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR));
	}
}

async function setMarkupPrice(req: Request, res: Response, next: NextFunction) {
	const rate = Number(req.body.rate) as number;

	try {
		const userService = await UserService.findById(req.locals.id);
		await userService.setMarkupPrice(rate);
		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		if (err instanceof CustomError) return next(err);
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR));
	}
}

async function createAgent(req: Request, res: Response, next: NextFunction) {
	const { email, name, phone, password } = req.locals.data as CreateAgentValidationResult;
	try {
		if (req.locals.user.userLevel < UserLevel.Admin) {
			return next(new CustomError(AUTH_ERRORS.PERMISSION_DENIED));
		}
		const id = await UserService.register(email, password, {
			name,
			phone,
			level: UserLevel.Agent,
			linked_to: req.locals.user.userId,
		});

		return Respond({
			res,
			status: 200,
			data: {
				id,
				email,
				name,
				phone,
			},
		});
	} catch (err) {
		return next(new CustomError(AUTH_ERRORS.USER_ALREADY_EXISTS));
	}
}

async function updateAgent(req: Request, res: Response, next: NextFunction) {
	const { email, name, phone } = req.locals.data as CreateAgentValidationResult;
	const { id, user } = req.locals;
	try {
		const details = await user.updateAgentDetails(id, {
			email,
			name,
			phone,
		});

		return Respond({
			res,
			status: 200,
			data: {
				...details,
			},
		});
	} catch (err) {
		return next(new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR));
	}
}

async function updateAgentPassword(req: Request, res: Response, next: NextFunction) {
	const { password } = req.locals.data as PasswordValidationResult;
	const { id, user } = req.locals;
	try {
		await user.updateAgentPassword(id, password);

		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		return next(new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR));
	}
}

async function assignPermissions(req: Request, res: Response, next: NextFunction) {
	const data = req.locals.data as PermissionsValidationResult;
	const { id, user } = req.locals;
	try {
		const details = await user.assignPermissions(id, data);

		return Respond({
			res,
			status: 200,
			data: {
				...details,
			},
		});
	} catch (err) {
		return next(new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR));
	}
}

async function getAgents(req: Request, res: Response, next: NextFunction) {
	const { user, serviceUser } = req.locals;
	try {
		let list = await serviceUser.getAgents();
		if (user.userLevel === UserLevel.Agent) {
			return Respond({
				res,
				status: 200,
				data: {
					list: list.map((agent) => ({
						id: agent.id,
						email: agent.email,
						name: agent.name,
						phone: agent.phone,
					})),
				},
			});
		}
		return Respond({
			res,
			status: 200,
			data: {
				list,
			},
		});
	} catch (err) {
		return next(new CustomError(AUTH_ERRORS.PERMISSION_DENIED));
	}
}

async function removeAgent(req: Request, res: Response, next: NextFunction) {
	const { id, user } = req.locals;
	user.removeAgent(id);

	return Respond({
		res,
		status: 200,
	});
}

async function agentLogs(req: Request, res: Response, next: NextFunction) {
	try {
		const { id, user } = req.locals;
		const agent = await user.getAgent(id);
		const agentLogService = new AgentLogService(user.account, agent);

		const logs = await agentLogService.getLogs();

		return Respond({
			res,
			status: 200,
			data: {
				logs,
			},
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function quickReplies(req: Request, res: Response, next: NextFunction) {
	const { user } = req.locals;

	const quickRepliesDocs = await QuickReplyDB.find({ linked_to: user.userId });

	return Respond({
		res,
		status: 200,
		data: {
			quickReplies: quickRepliesDocs.map((doc) => ({
				id: doc._id,
				message: doc.message,
			})),
		},
	});
}

async function saveQuickReply(req: Request, res: Response, next: NextFunction) {
	const { user, data } = req.locals;

	const quickReply = new QuickReplyDB({
		linked_to: user.userId,
		message: data,
	});

	await quickReply.save();

	return Respond({
		res,
		status: 200,
		data: {
			id: quickReply._id,
			message: quickReply.message,
		},
	});
}

async function deleteQuickReply(req: Request, res: Response, next: NextFunction) {
	const { user, id } = req.locals;

	await QuickReplyDB.deleteOne({ _id: id, linked_to: user.userId });

	return Respond({
		res,
		status: 200,
	});
}

async function editQuickReply(req: Request, res: Response, next: NextFunction) {
	const { user, id, data } = req.locals;

	const quickReply = await QuickReplyDB.findOne({ _id: id, linked_to: user.userId });

	if (!quickReply) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}

	quickReply.message = data;
	await quickReply.save();

	return Respond({
		res,
		status: 200,
		data: {
			id: quickReply._id,
			message: quickReply.message,
		},
	});
}

async function assignTask(req: Request, res: Response, next: NextFunction) {
	const { user } = req.locals;

	const data = req.locals.data as AssignTaskValidationResult;
	try {
		if (!data.assign_to) {
			const taskService = new TaskService(user.account);
			const task = await taskService.addTask({ message: data.message, due_date: data.due_date });
			return Respond({
				res,
				status: 200,
				data: {
					task,
				},
			});
		} else {
			const userService = await UserService.findById(data.assign_to);
			const taskService = new TaskService(userService.account);
			const task = await taskService.addTask({ message: data.message, due_date: data.due_date });

			return Respond({
				res,
				status: 200,
				data: {
					task,
				},
			});
		}
	} catch (err) {
		next(new CustomError(AUTH_ERRORS.PERMISSION_DENIED));
	}
}

async function getAssignedTask(req: Request, res: Response, next: NextFunction) {
	const { user, id } = req.locals;

	const date_from = req.query.date_from as string;
	const date_to = req.query.date_to as string;

	try {
		let tasks;

		if (id) {
			const userService = await UserService.findById(id);
			const taskService = new TaskService(userService.account);
			tasks = await taskService.listTasks({
				date_from,
				date_to,
			});
		} else {
			const taskService = new TaskService(user.account);
			tasks = await taskService.listTasks({
				date_from,
				date_to,
			});
		}

		return Respond({
			res,
			status: 200,
			data: {
				tasks,
			},
		});
	} catch (err) {
		next(new CustomError(AUTH_ERRORS.PERMISSION_DENIED));
	}
}

async function hideAssignedTask(req: Request, res: Response, next: NextFunction) {
	const { user, id } = req.locals;
	const taskService = new TaskService(user.account);
	await taskService.hideTask(id);

	return Respond({
		res,
		status: 200,
	});
}

const Controller = {
	getAdmins,
	extendSubscription,
	upgradePlan,
	setMarkupPrice,
	getAgents,
	createAgent,
	updateAgent,
	updateAgentPassword,
	assignPermissions,
	removeAgent,
	agentLogs,
	quickReplies,
	saveQuickReply,
	deleteQuickReply,
	editQuickReply,
	assignTask,
	hideAssignedTask,
	getAssignedTask,
};

export default Controller;
