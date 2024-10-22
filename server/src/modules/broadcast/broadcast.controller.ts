import { NextFunction, Request, Response } from 'express';
import { UNSUBSCRIBE_LABEL, UserLevel } from '../../config/const';
import { CustomError } from '../../errors';
import COMMON_ERRORS from '../../errors/common-errors';
import { TemplateMessage } from '../../models/message';
import TemplateFactory from '../../models/templates/templateFactory';
import BroadcastService from '../../services/broadcast';
import ButtonResponseService from '../../services/buttonResponse';
import PhoneBookService, { IPhonebookRecord } from '../../services/phonebook';
import CSVHelper from '../../utils/CSVHelper';
import { Respond, RespondCSV } from '../../utils/ExpressUtils';
import { parseToBodyVariables } from '../../utils/MessageHelper';
import {
	CreateBroadcastValidationResult,
	CreateRecurringValidationResult,
} from './broadcast.validator';

async function broadcastReport(req: Request, res: Response, next: NextFunction) {
	const {
		serviceAccount: account,
		device: { device },
	} = req.locals;
	try {
		const broadcastService = new BroadcastService(account, device);

		const reports = await broadcastService.fetchBroadcastReports();

		return Respond({
			res,
			status: 200,
			data: {
				reports,
			},
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR));
	}
}

async function pauseBroadcast(req: Request, res: Response, next: NextFunction) {
	const {
		id,
		serviceAccount: account,
		device: { device },
		agentLogService,
	} = req.locals;

	try {
		const broadcastService = new BroadcastService(account, device);
		const campaign = await broadcastService.pauseBroadcast(id);
		agentLogService?.addLog({
			text: `Paused broadcast ${campaign.name}`,
			data: {
				broadcast_id: id,
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

async function resumeBroadcast(req: Request, res: Response, next: NextFunction) {
	const {
		id,
		serviceAccount: account,
		device: { device },
		agentLogService,
	} = req.locals;

	try {
		const broadcastService = new BroadcastService(account, device);
		const campaign = await broadcastService.resumeBroadcast(id);
		agentLogService?.addLog({
			text: `Resume broadcast ${campaign.name}`,
			data: {
				broadcast_id: id,
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

async function resendBroadcast(req: Request, res: Response, next: NextFunction) {
	const {
		id,
		serviceAccount: account,
		device: { device },
		agentLogService,
	} = req.locals;

	try {
		const broadcastService = new BroadcastService(account, device);
		const campaign = await broadcastService.resendBroadcast(id);
		agentLogService?.addLog({
			text: `Resend broadcast ${campaign.name}`,
			data: {
				broadcast_id: id,
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

async function downloadBroadcast(req: Request, res: Response, next: NextFunction) {
	const {
		id,
		serviceAccount: account,
		device: { device },
		agentLogService,
	} = req.locals;

	try {
		const broadcastService = new BroadcastService(account, device);
		const records = await broadcastService.generateBroadcastReport(id);
		agentLogService?.addLog({
			text: `Download broadcast ${await broadcastService.getBroadcastName(id)}`,
			data: {
				broadcast_id: id,
			},
		});

		return RespondCSV({
			res,
			filename: `broadcast-${id}`,
			data: CSVHelper.exportBroadcastReport(records),
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function deleteBroadcast(req: Request, res: Response, next: NextFunction) {
	const {
		id,
		serviceAccount: account,
		device: { device },
		agentLogService,
	} = req.locals;

	try {
		const broadcastService = new BroadcastService(account, device);
		const campaign = await broadcastService.deleteBroadcast(id);
		agentLogService?.addLog({
			text: `Delete broadcast ${campaign.name}`,
			data: {
				broadcast_id: id,
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

async function sendTemplateMessage(req: Request, res: Response, next: NextFunction) {
	const {
		body,
		description,
		name,
		template_id,
		template_name,
		to,
		broadcast_options,
		labels,
		header,
		buttons,
		carousel,
		forceSchedule,
	} = req.locals.data as CreateBroadcastValidationResult;

	const {
		serviceAccount: account,
		agentLogService,
		device: { device },
	} = req.locals;

	try {
		const phoneBookService = new PhoneBookService(account);
		const broadcastService = new BroadcastService(account, device);

		let _to = to;
		if (to.length === 0) {
			_to = (
				await phoneBookService.fetchRecords({
					page: 1,
					limit: 99999999,
					labels,
				})
			)
				.map((record) => record.phone_number)
				.filter((number) => number);
		}

		if (!forceSchedule) {
			const unsubscribed = (
				await phoneBookService.fetchRecords({
					page: 1,
					limit: 99999999,
					labels: [UNSUBSCRIBE_LABEL],
				})
			)
				.map((record) => record.phone_number)
				.filter((number) => number);

			_to = _to.filter((number) => !unsubscribed.includes(number));
		}

		if (_to.length === 0) {
			return next(new CustomError(COMMON_ERRORS.INVALID_FIELDS));
		}

		const template = await TemplateFactory.findById(device, template_id);
		if (!template) {
			return next(new CustomError(COMMON_ERRORS.INVALID_FIELDS));
		}

		const tHeader = template.getHeader();
		const tButtons = template.getURLButtonsWithVariable();
		const tCarousel = template.getCarouselCards();

		const messages = _to.map(async (number) => {
			const msg = new TemplateMessage(number, template);
			const fields = await phoneBookService.findRecordByPhone(number);

			if (header && tHeader && tHeader.format !== 'TEXT') {
				msg.setMediaHeader(header as any);
			} else if (header?.text && tHeader && tHeader.format === 'TEXT') {
				if (tHeader?.example.length > 0) {
					const headerVariables = parseToBodyVariables({
						variables: header.text,
						fields: fields || ({} as IPhonebookRecord),
					});
					msg.setTextHeader(headerVariables);
				}
			}

			const bodyVariables = parseToBodyVariables({
				variables: body,
				fields: fields || ({} as IPhonebookRecord),
			});

			msg.setBody(bodyVariables);

			if (tButtons.length > 0) {
				msg.setButtons(buttons);
			}

			if (tCarousel.length > 0 && carousel) {
				const cards = carousel.cards.map((card, index) => {
					const bodyVariables = parseToBodyVariables({
						variables: card.body,
						fields: fields || ({} as IPhonebookRecord),
					});
					return {
						header: card.header,
						body: bodyVariables,
						buttons: card.buttons,
					};
				});
				msg.setCarousel(cards);
			}

			return msg;
		});

		await broadcastService.startBroadcast(
			{
				description,
				name,
				template_id,
				template_name,
				messages: await Promise.all(messages),
			},
			broadcast_options
		);

		agentLogService?.addLog({
			text: `Create broadcast ${name} of template ${template_name} to ${messages.length} numbers`,
		});

		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function listRecurringBroadcasts(req: Request, res: Response, next: NextFunction) {
	const {
		serviceAccount: account,
		device: { device },
	} = req.locals;

	try {
		const broadcastService = new BroadcastService(account, device);

		return Respond({
			res,
			status: 200,
			data: {
				list: await broadcastService.listRecurringBroadcasts(),
			},
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function scheduleRecurringBroadcast(req: Request, res: Response, next: NextFunction) {
	const data = req.locals.data as CreateRecurringValidationResult;

	const {
		serviceAccount: account,
		device: { device },
		agentLogService,
	} = req.locals;

	try {
		const broadcastService = new BroadcastService(account, device);

		const details = await broadcastService.scheduleRecurring(data);
		agentLogService?.addLog({
			text: `Create recurring broadcast ${data.name}`,
		});

		return Respond({
			res,
			status: 200,
			data: {
				details,
			},
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function updateRecurringBroadcast(req: Request, res: Response, next: NextFunction) {
	const data = req.locals.data as CreateRecurringValidationResult;

	const {
		serviceAccount: account,
		device: { device },
		id,
		agentLogService,
	} = req.locals;

	try {
		const broadcastService = new BroadcastService(account, device);

		const doc = await broadcastService.updateRecurringBroadcast(id, data);

		agentLogService?.addLog({
			text: `Update recurring broadcast ${doc.name}`,
			data: {
				recurring_broadcast_id: id,
			},
		});

		return Respond({
			res,
			status: 200,
			data: {
				details: doc,
			},
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function toggleRecurringBroadcast(req: Request, res: Response, next: NextFunction) {
	const {
		serviceAccount: account,
		agentLogService,
		device: { device },
		id,
	} = req.locals;

	try {
		const broadcastService = new BroadcastService(account, device);

		const { status, name } = await broadcastService.toggleRecurringBroadcast(id);

		agentLogService?.addLog({
			text: `Update recurring broadcast status ${name}`,
			data: {
				recurring_broadcast_id: id,
			},
		});

		return Respond({
			res,
			status: 200,
			data: {
				status,
			},
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function fetchRecurringBroadcast(req: Request, res: Response, next: NextFunction) {
	const {
		serviceAccount: account,
		device: { device },
		id,
	} = req.locals;

	try {
		const broadcastService = new BroadcastService(account, device);

		const details = await broadcastService.fetchRecurringReport(id);

		return RespondCSV({
			res,
			filename: `recurring-${id}`,
			data: CSVHelper.exportBroadcastReport(details),
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function deleteRecurringBroadcast(req: Request, res: Response, next: NextFunction) {
	const {
		serviceAccount: account,
		device: { device },
		id,
		agentLogService,
	} = req.locals;

	try {
		const broadcastService = new BroadcastService(account, device);

		const doc = await broadcastService.deleteRecurringBroadcast(id);

		agentLogService?.addLog({
			text: `Delete recurring broadcast ${doc.name}`,
		});

		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function rescheduleRecurringBroadcast(req: Request, res: Response, next: NextFunction) {
	const {
		serviceAccount: account,
		device: { device },
		id,
		agentLogService,
	} = req.locals;

	try {
		const broadcastService = new BroadcastService(account, device);

		const doc = await broadcastService.rescheduleRecurringBroadcast(id);

		agentLogService?.addLog({
			text: `Reschedule recurring broadcast ${doc.name}`,
			data: {
				recurring_broadcast_id: id,
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

async function buttonResponses(req: Request, res: Response, next: NextFunction) {
	const {
		agentLogService,
		serviceAccount: account,
		device: { device },
		id,
	} = req.locals;

	const export_csv = req.query.export_csv === 'true';

	const responses = await new ButtonResponseService(account, device).getResponses(id);

	if (export_csv) {
		const { user } = req.locals;
		if (user.userLevel === UserLevel.Agent) {
			const permissions = await user.getPermissions();
			if (!permissions.buttons.export) {
				return next(new CustomError(COMMON_ERRORS.PERMISSION_DENIED));
			}
		}

		agentLogService?.addLog({
			text: `Download button responses for broadcast ${id}`,
			data: {
				id,
			},
		});

		return RespondCSV({
			res,
			filename: `responses-${id}.csv`,
			data: CSVHelper.exportButtonResponseReport(responses),
		});
	}
	return Respond({
		res,
		status: 200,
		data: {
			responses,
		},
	});
}

const Controller = {
	sendTemplateMessage,
	broadcastReport,
	pauseBroadcast,
	resumeBroadcast,
	deleteBroadcast,
	resendBroadcast,
	downloadBroadcast,
	listRecurringBroadcasts,
	scheduleRecurringBroadcast,
	updateRecurringBroadcast,
	toggleRecurringBroadcast,
	deleteRecurringBroadcast,
	rescheduleRecurringBroadcast,
	buttonResponses,
	fetchRecurringBroadcast,
};

export default Controller;
