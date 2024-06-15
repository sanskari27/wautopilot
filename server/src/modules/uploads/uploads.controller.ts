import { NextFunction, Request, Response } from 'express';
import FormData from 'form-data';
import fs from 'fs';
import FileUpload, { ResolvedFile } from '../../config/FileUpload';
import MetaAPI from '../../config/MetaAPI';
import { CustomError } from '../../errors';
import COMMON_ERRORS from '../../errors/common-errors';
import { Respond } from '../../utils/ExpressUtils';
import FileUtils from '../../utils/FileUtils';

async function uploadMetaHandle(req: Request, res: Response, next: NextFunction) {
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
		FileUtils.deleteFile(uploadedFile.path);
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
		FileUtils.deleteFile(uploadedFile.path);
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR, e));
	}
}

async function uploadMetaMedia(req: Request, res: Response, next: NextFunction) {
	let uploadedFile: ResolvedFile | null = null;
	try {
		uploadedFile = await FileUpload.SingleFileUpload(req, res, {
			field_name: 'file',
			options: {},
		});
	} catch (e) {
		return next(new CustomError(COMMON_ERRORS.FILE_UPLOAD_ERROR));
	}

	try {
		const form = new FormData();
		form.append('messaging_product', 'whatsapp');
		form.append('file', fs.createReadStream(uploadedFile.path));

		const { data } = await MetaAPI.post(`/${req.locals.device.phoneNumberId}/media`, form, {
			headers: {
				Authorization: `Bearer ${req.locals.device.accessToken}`,
				'Content-Type': 'multipart/form-data',
			},
		});
		return Respond({
			res,
			status: 200,
			data: {
				media_id: data.id,
			},
		});
	} catch (e) {
		FileUtils.deleteFile(uploadedFile.path);
		next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR, e));
	}
}

async function fetchMetaMediaUrl(req: Request, res: Response, next: NextFunction) {
	const media_id = req.params.id;
	try {
		const { data } = await MetaAPI.get(`/${media_id}`, {
			headers: {
				Authorization: `Bearer ${req.locals.device.accessToken}`,
			},
		});
		return Respond({
			res,
			status: 200,
			data: {
				url: data.url,
				size: data.file_size,
				mime_type: data.mime_type,
			},
		});
	} catch (e) {
		next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

const Controller = {
	uploadMetaHandle,
	uploadMetaMedia,
	fetchMetaMediaUrl,
};

export default Controller;
