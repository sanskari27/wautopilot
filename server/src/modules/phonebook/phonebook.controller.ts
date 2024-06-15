import csv from 'csvtojson/v2';
import { NextFunction, Request, Response } from 'express';
import FileUpload, { ONLY_CSV_ALLOWED, SingleFileUploadOptions } from '../../config/FileUpload';
import { CustomError } from '../../errors';
import COMMON_ERRORS from '../../errors/common-errors';
import PhoneBookService from '../../services/phonebook';
import CSVHelper from '../../utils/CSVHelper';
import { Respond, RespondCSV, idValidator } from '../../utils/ExpressUtils';
import {
	MultiDeleteValidationResult,
	RecordsValidationResult,
	SetLabelValidationResult,
	SingleRecordValidationResult,
} from './phonebook.validator';

async function getAllLabels(req: Request, res: Response, next: NextFunction) {
	try {
		const phoneBookService = new PhoneBookService(req.locals.account);
		const labels = await phoneBookService.getAllLabels();

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
	const { records } = req.locals.data as RecordsValidationResult;

	try {
		const phoneBookService = new PhoneBookService(req.locals.account);
		const created = await phoneBookService.addRecords(records);

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
	const page = req.query.page ? parseInt(req.query.page as string) : 1;
	const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
	const labels = req.query.labels ? (req.query.labels as string).split(',') : [];
	try {
		const phoneBookService = new PhoneBookService(req.locals.account);
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
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function exportRecords(req: Request, res: Response, next: NextFunction) {
	try {
		const phoneBookService = new PhoneBookService(req.locals.account);
		const records = await phoneBookService.fetchRecords({
			page: 1,
			limit: 9999999,
			labels: req.query.labels ? (req.query.labels as string).split(',') : [],
		});

		const processedRecords = records.map((record) => {
			const { id, others, ...rest } = record;
			return {
				...rest,
				...others,
				labels: record.labels.join(','),
			};
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
	const data = req.locals.data as SingleRecordValidationResult;
	const id = req.locals.id;

	try {
		const phoneBookService = new PhoneBookService(req.locals.account);
		const created = await phoneBookService.updateRecord(id, data);

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
	const id = req.locals.id;

	try {
		const phoneBookService = new PhoneBookService(req.locals.account);
		await phoneBookService.deleteRecord([id]);

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

	try {
		const phoneBookService = new PhoneBookService(req.locals.account);
		await phoneBookService.deleteRecord(ids);

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

async function setLabels(req: Request, res: Response, next: NextFunction) {
	const { labels, ids } = req.locals.data as SetLabelValidationResult;

	try {
		const phoneBookService = new PhoneBookService(req.locals.account);
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
	const { labels, ids } = req.locals.data as SetLabelValidationResult;

	try {
		const phoneBookService = new PhoneBookService(req.locals.account);
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
	const { labels, ids } = req.locals.data as SetLabelValidationResult;

	try {
		const phoneBookService = new PhoneBookService(req.locals.account);
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

	try {
		const uploadedFile = await FileUpload.SingleFileUpload(req, res, fileUploadOptions);
		const labels = req.body.labels ? req.body.labels.split(',') : [];

		const parsed_csv = await csv().fromFile(uploadedFile.path);

		if (!parsed_csv) {
			return next(new CustomError(COMMON_ERRORS.ERROR_PARSING_CSV));
		}

		const phoneBookService = new PhoneBookService(req.locals.account);
		const created = await phoneBookService.addRecords(parsed_csv);

		const ids = created.map((record) => idValidator(record.id)[1]!);
		await phoneBookService.setLabels(ids, labels);

		return Respond({
			res,
			status: 200,
			data: {
				records: created,
			},
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
	bulkUpload,
};

export default Controller;
