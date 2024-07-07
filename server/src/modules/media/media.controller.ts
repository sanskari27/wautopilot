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
	const {
		serviceAccount: account,
		device: { device },
		agentLogService,
	} = req.locals;
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
		} = await MetaAPI(device.accessToken).post(`/${device.phoneNumberId}/media`, form, {
			maxContentLength: Infinity,
			maxBodyLength: Infinity,
		});

		const { data } = await MetaAPI(device.accessToken).get(`/${media_id}`);

		const media = await new MediaService(account, device).addMedia({
			filename: req.body.filename || uploadedFile.filename,
			media_id,
			media_url: data.url,
			file_length: Number(data.file_size),
			mime_type: data.mime_type,
			local_path: Path.Media + uploadedFile.filename,
		});

		agentLogService?.addLog({
			text: `Create media with name ${media.filename}`,
			data: {
				id: media.id,
			},
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
	const {
		serviceAccount: account,
		device: { device },
		id,
	} = req.locals;
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
	const {
		serviceAccount: account,
		device: { device },
		id,
		agentLogService,
	} = req.locals;

	let media;
	try {
		media = await new MediaService(account, device).getMedia(id);
		await MetaAPI(device.accessToken).delete(
			`/${media.media_id}/?phone_number_id=${device.phoneNumberId}`
		);
	} catch (err: unknown) {
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR));
	}

	try {
		let path = await new MediaService(account, device).delete(id);
		path = __basedir + path;
		FileUtils.deleteFile(path);

		agentLogService?.addLog({
			text: `Delete media with name ${media.filename}`,
			data: {
				id: media.id,
			},
		});

		return Respond({
			res,
			status: 200,
			data: {},
		});
	} catch (err: unknown) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function mediaById(req: Request, res: Response, next: NextFunction) {
	const {
		serviceAccount: account,
		device: { device },
		id,
	} = req.locals;

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
	const {
		serviceAccount: account,
		device: { device },
	} = req.locals;

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
