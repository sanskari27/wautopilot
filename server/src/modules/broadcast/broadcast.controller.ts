import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../../errors';
import COMMON_ERRORS from '../../errors/common-errors';
import BroadcastService from '../../services/broadcast';
import ButtonResponseService from '../../services/buttonResponse';
import PhoneBookService from '../../services/phonebook';
import CSVHelper from '../../utils/CSVHelper';
import { Respond, RespondCSV } from '../../utils/ExpressUtils';
import {
	CreateBroadcastValidationResult,
	CreateRecurringValidationResult,
} from './broadcast.validator';

const bodyParametersList = [
	'first_name',
	'last_name',
	'middle_name',
	'phone_number',
	'email',
	'birthday',
	'anniversary',
];

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
	} = req.locals;

	try {
		const broadcastService = new BroadcastService(account, device);
		await broadcastService.pauseBroadcast(id);

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
	} = req.locals;

	try {
		const broadcastService = new BroadcastService(account, device);
		await broadcastService.resumeBroadcast(id);

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
	} = req.locals;

	try {
		const broadcastService = new BroadcastService(account, device);
		await broadcastService.resendBroadcast(id);

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
	} = req.locals;

	try {
		const broadcastService = new BroadcastService(account, device);
		const records = await broadcastService.generateBroadcastReport(id);

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
	} = req.locals;

	try {
		const broadcastService = new BroadcastService(account, device);
		await broadcastService.deleteBroadcast(id);

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
	} = req.locals.data as CreateBroadcastValidationResult;

	const {
		serviceAccount: account,
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

		if (_to.length === 0) {
			return next(new CustomError(COMMON_ERRORS.INVALID_FIELDS));
		}

		const messages = _to.map(async (number) => {
			const fields = await phoneBookService.findRecordByPhone(number);

			let headers = [] as Record<string, unknown>[];

			if (header) {
				const object = {
					...(header.media_id ? { id: header.media_id } : header.link ? { link: header.link } : {}),
				};

				headers = [
					{
						type: 'HEADER',
						parameters:
							header.type !== 'TEXT'
								? [
										{
											type: header.type,
											[header.type.toLowerCase()]: object,
										},
								  ]
								: [],
					},
				];
			}

			return {
				to: number,
				messageObject: {
					template_name,
					to: number,
					components: [
						{
							type: 'BODY',
							parameters: body.map((b) => {
								if (b.variable_from === 'custom_text') {
									return {
										type: 'text',
										text: b.custom_text,
									};
								} else {
									if (!fields) {
										return {
											type: 'text',
											text: b.fallback_value,
										};
									}

									const fieldVal = (
										bodyParametersList.includes(b.phonebook_data)
											? fields[b.phonebook_data as keyof typeof fields]
											: fields.others[b.phonebook_data]
									) as string;

									if (typeof fieldVal === 'string') {
										return {
											type: 'text',
											text: fieldVal || b.fallback_value,
										};
									}
									// const field = fields[]
									return {
										type: 'text',
										text: b.fallback_value,
									};
								}
							}),
						},
						...headers,
					],
				},
			};
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
	} = req.locals;

	try {
		const broadcastService = new BroadcastService(account, device);

		const details = await broadcastService.scheduleRecurring(data);

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
	} = req.locals;

	try {
		const broadcastService = new BroadcastService(account, device);

		await broadcastService.updateRecurringBroadcast(id, data);

		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function toggleRecurringBroadcast(req: Request, res: Response, next: NextFunction) {
	const {
		serviceAccount: account,
		device: { device },
		id,
	} = req.locals;

	try {
		const broadcastService = new BroadcastService(account, device);

		const status = await broadcastService.toggleRecurringBroadcast(id);

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
	} = req.locals;

	try {
		const broadcastService = new BroadcastService(account, device);

		await broadcastService.deleteRecurringBroadcast(id);

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
	} = req.locals;

	try {
		const broadcastService = new BroadcastService(account, device);

		await broadcastService.rescheduleRecurringBroadcast(id);

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
		serviceAccount: account,
		device: { device },
		id,
	} = req.locals;

	const export_csv = req.query.export_csv === 'true';

	const responses = await new ButtonResponseService(account, device).getResponses(id);

	if (export_csv) {
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
