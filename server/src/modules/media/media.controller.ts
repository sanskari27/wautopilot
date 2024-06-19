import { NextFunction, Request, Response } from 'express';
import FormData from 'form-data';
import fs from 'fs';
import FileUpload, { ResolvedFile, SingleFileUploadOptions } from '../../config/FileUpload';
import MetaAPI from '../../config/MetaAPI';
import { Path } from '../../config/const';
import { CustomError } from '../../errors';
import COMMON_ERRORS from '../../errors/common-errors';
import MediaService from '../../services/media';
import { Respond, RespondFile } from '../../utils/ExpressUtils';
import FileUtils from '../../utils/FileUtils';

async function addMedia(req: Request, res: Response, next: NextFunction) {
	const { account, device } = req.locals;
	const fileUploadOptions: SingleFileUploadOptions = {
		field_name: 'file',
		options: {},
	};

	let uploadedFile: ResolvedFile | null = null;
	let destination: string | null = null;

	try {
		uploadedFile = await FileUpload.SingleFileUpload(req, res, fileUploadOptions);
		destination = __basedir + Path.Media + uploadedFile.filename;
		FileUtils.moveFile(uploadedFile.path, destination);
	} catch (err: unknown) {
		return next(new CustomError(COMMON_ERRORS.FILE_UPLOAD_ERROR));
	}

	try {
		const form = new FormData();
		form.append('messaging_product', 'whatsapp');
		form.append('file', fs.createReadStream(destination));

		const {
			data: { id: media_id },
		} = await MetaAPI.post(`/${device.phoneNumberId}/media`, form, {
			headers: {
				Authorization: `Bearer ${device.accessToken}`,
				'Content-Type': 'multipart/form-data',
			},
		});

		const { data } = await MetaAPI.get(`/${media_id}`, {
			headers: {
				Authorization: `Bearer ${req.locals.device.accessToken}`,
			},
		});

		const media = await new MediaService(account, device).addMedia({
			filename: uploadedFile.filename,
			media_id,
			media_url: data.url,
			file_length: Number(data.file_size),
			mime_type: data.mime_type,
			local_path: Path.Media + uploadedFile.filename,
		});

		return Respond({
			res,
			status: 200,
			data: {
				media,
			},
		});
	} catch (e) {
		FileUtils.deleteFile(destination);
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR, e));
	}
}

async function downloadMedia(req: Request, res: Response, next: NextFunction) {
	const { account, device, id } = req.locals;
	try {
		let path = await new MediaService(account, device).getMediaLocalPath(id);
		path = __basedir + path;

		return RespondFile({
			res,
			filename:
				'Media File.' +
				FileUtils.getExt(FileUtils.getMimeType(path) || 'application/octet-stream')!,
			filepath: path,
		});
	} catch (err: unknown) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function deleteMedia(req: Request, res: Response, next: NextFunction) {
	const { account, device, id } = req.locals;

	try {
		const media = await new MediaService(account, device).getMedia(id);
		await MetaAPI.delete(`/${media.media_id}/?phone_number_id=${device.phoneNumberId}`, {
			headers: {
				Authorization: `Bearer ${device.accessToken}`,
			},
		});
	} catch (err: unknown) {
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR));
	}

	try {
		let path = await new MediaService(account, device).delete(id);
		path = __basedir + path;
		FileUtils.deleteFile(path);
		return Respond({
			res,
			status: 200,
			data: {},
		});
	} catch (err: unknown) {
		return next(new CustomError(COMMON_ERRORS.FILE_UPLOAD_ERROR));
	}
}

async function mediaById(req: Request, res: Response, next: NextFunction) {
	const { account, device, id } = req.locals;

	try {
		const media = await new MediaService(account, device).getMedia(id);
		return Respond({
			res,
			status: 200,
			data: {
				media,
			},
		});
	} catch (err: unknown) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function listMedia(req: Request, res: Response, next: NextFunction) {
	const { account, device } = req.locals;

	const list = await new MediaService(account, device).listMedias();
	return Respond({
		res,
		status: 200,
		data: {
			list,
		},
	});
}

const Controller = {
	addMedia,
	downloadMedia,
	deleteMedia,
	mediaById,
	listMedia,
};

export default Controller;
