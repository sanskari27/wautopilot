import csv from 'csvtojson/v2';
import { NextFunction, Request, Response } from 'express';
import FileUpload, { ONLY_CSV_ALLOWED, SingleFileUploadOptions } from '../../config/FileUpload';
import { UserLevel } from '../../config/const';
import { CustomError } from '../../errors';
import COMMON_ERRORS from '../../errors/common-errors';
import PhoneBookService from '../../services/phonebook';
import CSVHelper from '../../utils/CSVHelper';
import { Respond, RespondCSV, intersection } from '../../utils/ExpressUtils';
import {
	MultiDeleteValidationResult,
	RecordsValidationResult,
	SetLabelValidationResult,
	SingleRecordValidationResult,
} from './phonebook.validator';

async function getAllLabels(req: Request, res: Response, next: NextFunction) {
	const { user, serviceAccount } = req.locals;
	try {
		const phoneBookService = new PhoneBookService(serviceAccount);
		let labels = await phoneBookService.getAllLabels();

		if (user.userLevel === UserLevel.Agent) {
			const permissions = await user.getPermissions();
			const allowedLabels = permissions.assigned_labels;
			labels = intersection(labels, allowedLabels);
		}

		return Respond({
			res,
			status: 200,
			data: {
				labels,
			},
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function addRecords(req: Request, res: Response, next: NextFunction) {
	const { serviceAccount, agentLogService } = req.locals;
	const { records } = req.locals.data as RecordsValidationResult;

	try {
		const phoneBookService = new PhoneBookService(serviceAccount);
		const created = await phoneBookService.addRecords(records);

		agentLogService?.addLog({
			text: `Create phonebook records`,
		});

		return Respond({
			res,
			status: 200,
			data: {
				records: created,
			},
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function records(req: Request, res: Response, next: NextFunction) {
	const { user, serviceAccount } = req.locals;
	const page = req.query.page ? parseInt(req.query.page as string) || 1 : 1;
	const limit = req.query.limit ? parseInt(req.query.limit as string) || 20 : 20;
	let labels = req.query.labels ? (req.query.labels as string).split(',') : [];

	if (user.userLevel === UserLevel.Agent) {
		const permissions = await user.getPermissions();
		const allowedLabels = permissions.assigned_labels;

		if (allowedLabels.length === 0) {
			return Respond({
				res,
				status: 200,
				data: {
					records: [],
					totalRecords: 0,
				},
			});
		}
		if (labels.length > 0) {
			labels = intersection(labels, allowedLabels);
		} else {
			labels = allowedLabels;
		}
	}

	try {
		const phoneBookService = new PhoneBookService(serviceAccount);

		const records = await phoneBookService.fetchRecords({
			page,
			limit,
			labels,
		});

		const totalRecords = await phoneBookService.totalRecords(labels);

		return Respond({
			res,
			status: 200,
			data: {
				records,
				totalRecords,
			},
		});
	} catch (err) {
		console.log(err);

		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function exportRecords(req: Request, res: Response, next: NextFunction) {
	const { user, serviceAccount, agentLogService } = req.locals;
	let labels = req.query.labels ? (req.query.labels as string).split(',') : [];

	if (user.userLevel === UserLevel.Agent) {
		const permissions = await user.getPermissions();
		const allowedLabels = permissions.assigned_labels;

		if (allowedLabels.length === 0) {
			return RespondCSV({
				res,
				filename: 'phonebook.csv',
				data: CSVHelper.exportPhonebook([]),
			});
		}
		if (labels.length > 0) {
			labels = intersection(labels, allowedLabels);
		} else {
			labels = allowedLabels;
		}
	}

	try {
		const phoneBookService = new PhoneBookService(serviceAccount);
		const records = await phoneBookService.fetchRecords({
			page: 1,
			limit: 9999999,
			labels,
		});

		const processedRecords = records.map((record) => {
			const { id, others, ...rest } = record;
			return {
				...rest,
				...others,
				labels: record.labels.join(','),
			};
		});

		agentLogService?.addLog({
			text: `Export phonebook records to CSV ${labels.join(',')}`,
		});

		return RespondCSV({
			res,
			filename: 'phonebook.csv',
			data: CSVHelper.exportPhonebook(processedRecords),
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function updateRecords(req: Request, res: Response, next: NextFunction) {
	const { serviceAccount, agentLogService } = req.locals;
	const data = req.locals.data as SingleRecordValidationResult;
	const id = req.locals.id;

	try {
		const phoneBookService = new PhoneBookService(serviceAccount);
		const created = await phoneBookService.updateRecord(id, data);

		agentLogService?.addLog({
			text: `Update phonebook records`,
		});

		return Respond({
			res,
			status: 200,
			data: {
				records: created,
			},
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function deleteRecords(req: Request, res: Response, next: NextFunction) {
	const { serviceAccount, id, agentLogService } = req.locals;

	try {
		const phoneBookService = new PhoneBookService(serviceAccount);
		await phoneBookService.deleteRecord([id]);

		agentLogService?.addLog({
			text: `Delete phonebook records`,
		});

		return Respond({
			res,
			status: 200,
			data: {
				message: 'Record deleted',
			},
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function deleteMultiple(req: Request, res: Response, next: NextFunction) {
	const { ids } = req.locals.data as MultiDeleteValidationResult;

	const { serviceAccount, agentLogService } = req.locals;

	try {
		const phoneBookService = new PhoneBookService(serviceAccount);
		await phoneBookService.deleteRecord(ids);

		agentLogService?.addLog({
			text: `Delete phonebook records`,
		});

		return Respond({
			res,
			status: 200,
			data: {
				message: 'Records deleted',
			},
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function setLabelsByPhone(req: Request, res: Response, next: NextFunction) {
	const { user, serviceAccount } = req.locals;

	const phone_number = req.params.phone_number;
	let labels = Array.isArray(req.body.labels) ? [...new Set(req.body.labels as string[])] : [];

	if (user.userLevel === UserLevel.Agent) {
		const permissions = await user.getPermissions();
		const allowedLabels = permissions.assigned_labels;
		labels = intersection(labels, allowedLabels);
	}

	if (!phone_number) {
		return next(new CustomError(COMMON_ERRORS.INVALID_FIELDS));
	}

	try {
		const phoneBookService = new PhoneBookService(serviceAccount);
		const doc = await phoneBookService.findRecordByPhone(phone_number);
		if (!doc) {
			return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
		}

		await phoneBookService.setLabels([doc.id], labels);

		return Respond({
			res,
			status: 200,
			data: {
				message: 'Labels added',
			},
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function setLabels(req: Request, res: Response, next: NextFunction) {
	const { user, serviceAccount } = req.locals;
	const { ids } = req.locals.data as SetLabelValidationResult;
	let { labels } = req.locals.data as SetLabelValidationResult;
	if (user.userLevel === UserLevel.Agent) {
		const permissions = await user.getPermissions();
		const allowedLabels = permissions.assigned_labels;
		labels = intersection(labels, allowedLabels);
	}

	try {
		const phoneBookService = new PhoneBookService(serviceAccount);
		await phoneBookService.setLabels(ids, labels);

		return Respond({
			res,
			status: 200,
			data: {
				message: 'Labels added',
			},
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function addLabels(req: Request, res: Response, next: NextFunction) {
	const { user, serviceAccount } = req.locals;
	const { ids } = req.locals.data as SetLabelValidationResult;
	let { labels } = req.locals.data as SetLabelValidationResult;
	if (user.userLevel === UserLevel.Agent) {
		const permissions = await user.getPermissions();
		const allowedLabels = permissions.assigned_labels;
		labels = intersection(labels, allowedLabels);
	}

	try {
		const phoneBookService = new PhoneBookService(serviceAccount);
		await phoneBookService.addLabels(ids, labels);

		return Respond({
			res,
			status: 200,
			data: {
				message: 'Labels added',
			},
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function removeLabels(req: Request, res: Response, next: NextFunction) {
	const { user, serviceAccount } = req.locals;
	const { ids } = req.locals.data as SetLabelValidationResult;
	let { labels } = req.locals.data as SetLabelValidationResult;
	if (user.userLevel === UserLevel.Agent) {
		const permissions = await user.getPermissions();
		const allowedLabels = permissions.assigned_labels;
		labels = intersection(labels, allowedLabels);
	}

	try {
		const phoneBookService = new PhoneBookService(serviceAccount);
		await phoneBookService.removeLabels(ids, labels);

		return Respond({
			res,
			status: 200,
			data: {
				message: 'Labels added',
			},
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

export async function bulkUpload(req: Request, res: Response, next: NextFunction) {
	const fileUploadOptions: SingleFileUploadOptions = {
		field_name: 'file',
		options: {
			fileFilter: ONLY_CSV_ALLOWED,
		},
	};
	const { serviceAccount, user, agentLogService } = req.locals;

	try {
		const uploadedFile = await FileUpload.SingleFileUpload(req, res, fileUploadOptions);
		let labels = req.body.labels ? req.body.labels.split(',') : [];

		if (user.userLevel === UserLevel.Agent) {
			const permissions = await user.getPermissions();
			const allowedLabels = permissions.assigned_labels;
			labels = intersection(labels, allowedLabels);
		}

		const parsed_csv = await csv().fromFile(uploadedFile.path);

		if (!parsed_csv) {
			return next(new CustomError(COMMON_ERRORS.ERROR_PARSING_CSV));
		}

		const phoneBookService = new PhoneBookService(serviceAccount);
		const data = parsed_csv.map((record) => {
			const { prefix, tags, ...rest } = record;
			return {
				...rest,
				salutation: prefix,
				labels: [...labels, ...(tags ?? '').split(',')].filter(Boolean),
			};
		});

		const uniqueDataMap = new Map();

		data.forEach((record) => {
			const key = record.phone_number; // Use the appropriate unique key
			if (!uniqueDataMap.has(key)) {
				uniqueDataMap.set(key, record);
			} else {
				// Optional: Merge labels if duplicate entries exist
				const existingRecord = uniqueDataMap.get(key);
				existingRecord.labels = [...new Set([...existingRecord.labels, ...record.labels])];
				uniqueDataMap.set(key, existingRecord);
			}
		});

		// Convert the Map back to an array
		const uniqueData = Array.from(uniqueDataMap.values());

		phoneBookService.addRecords(uniqueData);

		agentLogService?.addLog({
			text: `Bulk upload phonebook records`,
		});

		return Respond({
			res,
			status: 200,
		});
	} catch (err: unknown) {
		if (err instanceof CustomError) {
			return next(err);
		}
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR, err));
	}
}

const Controller = {
	addRecords,
	records,
	exportRecords,
	updateRecords,
	deleteRecords,
	deleteMultiple,
	setLabels,
	addLabels,
	removeLabels,
	getAllLabels,
	setLabelsByPhone,
	bulkUpload,
};

export default Controller;
