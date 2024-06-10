import { NextFunction, Request, Response } from 'express';
import FormData from 'form-data';
import fs from 'fs';
import FileUpload, { ResolvedFile } from '../../config/FileUpload';
import MetaAPI from '../../config/MetaAPI';
import { CustomError } from '../../errors';
import COMMON_ERRORS from '../../errors/common-errors';
import { Respond } from '../../utils/ExpressUtils';
export const JWT_EXPIRE_TIME = 3 * 60 * 1000;
export const SESSION_EXPIRE_TIME = 28 * 24 * 60 * 60 * 1000;

async function upload(req: Request, res: Response, next: NextFunction) {
	let uploadedFile: ResolvedFile | null = null;
	try {
		uploadedFile = await FileUpload.SingleFileUpload(req, res, {
			field_name: 'file',
			options: {},
		});
	} catch (e) {
		return next(new CustomError(COMMON_ERRORS.FILE_UPLOAD_ERROR));
	}

	let id = '';
	try {
		const { data } = await MetaAPI.post(
			'/app/uploads',
			{},
			{
				params: {
					file_length: uploadedFile.size,
					file_type: uploadedFile.mime,
				},
				headers: {
					Authorization: `OAuth ${req.locals.device.accessToken}`,
				},
			}
		);
		id = data.id;
	} catch (e) {
		next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR, e));
	}

	try {
		const fileBuffer = fs.readFileSync(uploadedFile.path);
		const form = new FormData();
		form.append('file', fileBuffer);
		const { data } = await MetaAPI.post(id, form, {
			headers: {
				Authorization: `OAuth ${req.locals.device.accessToken}`,
				file_offset: 0,
				'Content-Type': uploadedFile.mime,
				'Content-Length': uploadedFile.size,
			},
		});

		return Respond({
			res,
			status: 200,
			data: {
				file: data.h,
			},
		});
	} catch (e) {
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR, e));
	}
}

const Controller = {
	upload,
};

export default Controller;
