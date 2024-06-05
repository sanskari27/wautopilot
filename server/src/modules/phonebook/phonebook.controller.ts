import csv from 'csvtojson/v2';
import { NextFunction, Request, Response } from 'express';
import FileUpload, { ONLY_CSV_ALLOWED, SingleFileUploadOptions } from '../../config/FileUpload';
import { CustomError } from '../../errors';
import COMMON_ERRORS from '../../errors/common-errors';
import PhoneBookService from '../../services/phonebook';
import { Respond } from '../../utils/ExpressUtils';
import {
	LabelsResult,
	RecordsValidationResult,
	SingleRecordValidationResult,
} from './phonebook.validator';
export const JWT_EXPIRE_TIME = 3 * 60 * 1000;
export const SESSION_EXPIRE_TIME = 28 * 24 * 60 * 60 * 1000;

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
	try {
		const phoneBookService = new PhoneBookService(req.locals.account);
		const records = await phoneBookService.fetchRecords();

		return Respond({
			res,
			status: 200,
			data: {
				records,
			},
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
		await phoneBookService.deleteRecord(id);

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

async function setLabels(req: Request, res: Response, next: NextFunction) {
	const id = req.locals.id;

	try {
		const phoneBookService = new PhoneBookService(req.locals.account);
		await phoneBookService.setLabels(id, req.locals.data as LabelsResult);

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

		const parsed_csv = await csv().fromFile(uploadedFile.path);

		if (!parsed_csv) {
			return next(new CustomError(COMMON_ERRORS.ERROR_PARSING_CSV));
		}
		console.log(parsed_csv);

		const phoneBookService = new PhoneBookService(req.locals.account);
		const created = await phoneBookService.addRecords(parsed_csv);

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
	updateRecords,
	deleteRecords,
	setLabels,
	getAllLabels,
	bulkUpload,
};

export default Controller;
