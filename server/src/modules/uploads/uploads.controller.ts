import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import FormData from 'form-data';
import fs from 'fs';
import { StorageDB } from '../../../mongo';
import FileUpload, { ResolvedFile } from '../../config/FileUpload';
import MetaAPI from '../../config/MetaAPI';
import { CustomError } from '../../errors';
import COMMON_ERRORS from '../../errors/common-errors';
import DateUtils from '../../utils/DateUtils';
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
		const { data } = await MetaAPI().post(
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
		const { data } = await MetaAPI().post(id, form, {
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
	const { device } = req.locals;
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

		const { data } = await MetaAPI(device.accessToken).post(
			`/${device.phoneNumberId}/media`,
			form,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			}
		);
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
	const device = req.locals.device;

	const { exists, data } = await StorageDB.get(`media:${media_id}`);

	const details = {
		url: '',
		size: 0,
		mime_type: '',
	};
	if (exists) {
		const obj = data!.object;
		if (!obj) {
			return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
		}
		details.url = obj.url as string;
		details.size = obj.size as number;
		details.mime_type = obj.mime_type as string;
	} else {
		try {
			const { data } = await MetaAPI(device.accessToken).get(
				`/${media_id}?phone_number_id=${device.phoneNumberId}`
			);

			details.url = data.url;
			details.size = data.file_size;
			details.mime_type = data.mime_type;

			await StorageDB.setObject(
				`media:${media_id}`,
				details,
				DateUtils.getMomentNow().add(28, 'days').toDate()
			);
		} catch (e) {
			await StorageDB.setObject(
				`media:${media_id}`,
				null,
				DateUtils.getMomentNow().add(28, 'days').toDate()
			);
			return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
		}
	}
	return Respond({
		res,
		status: 200,
		data: details,
	});
}

async function downloadMetaMedia(req: Request, res: Response, next: NextFunction) {
	const id = req.params.id;
	if (!id || typeof id !== 'string') {
		return next(new CustomError(COMMON_ERRORS.INVALID_FIELDS));
	}
	try {
		const { data } = await MetaAPI(req.locals.device.accessToken).get(`/${id}`);

		const response = await axios.get(data.url, {
			responseType: 'stream',
			headers: {
				Authorization: `Bearer ${req.locals.device.accessToken}`,
			},
		});

		res.setHeader('Content-Type', response.headers['content-type']);
		res.setHeader('Content-Disposition', 'inline');
		return response.data.pipe(res);
	} catch (err) {
		next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR, err));
	}
}

const Controller = {
	uploadMetaHandle,
	uploadMetaMedia,
	fetchMetaMediaUrl,
	downloadMetaMedia,
};

export default Controller;
