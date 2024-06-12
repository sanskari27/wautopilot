import { NextFunction, Request, Response } from 'express';
import FormData from 'form-data';
import fs from 'fs';
import FileUpload, { ResolvedFile, SingleFileUploadOptions } from '../../config/FileUpload';
import MetaAPI from '../../config/MetaAPI';
import { Path } from '../../config/const';
import { CustomError } from '../../errors';
import COMMON_ERRORS from '../../errors/common-errors';
import AttachmentService from '../../services/attachments';
import { Respond, RespondFile } from '../../utils/ExpressUtils';
import FileUtils from '../../utils/FileUtils';

async function addAttachment(req: Request, res: Response, next: NextFunction) {
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

		const { data } = await MetaAPI.post(`/${device.phoneNumberId}/media`, form, {
			headers: {
				Authorization: `Bearer ${device.accessToken}`,
				'Content-Type': 'multipart/form-data',
			},
		});

		const attachment = await new AttachmentService(account, device).addAttachment({
			filename: uploadedFile.filename,
			media_id: data.id,
			media_url: data.url,
			file_length: data.file_size,
			mime_type: data.mime_type,
			local_path: destination,
		});

		return Respond({
			res,
			status: 200,
			data: {
				attachment,
			},
		});
	} catch (e) {
		console.log((e as any).response.data);

		FileUtils.deleteFile(destination);
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR, e));
	}
}

async function downloadAttachment(req: Request, res: Response, next: NextFunction) {
	const { account, device, id } = req.locals;
	try {
		const path = await new AttachmentService(account, device).getAttachmentLocalPath(id);
		return RespondFile({
			res,
			filename: 'attachment File',
			filepath: path,
		});
	} catch (err: unknown) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function deleteAttachment(req: Request, res: Response, next: NextFunction) {
	const { account, device, id } = req.locals;

	try {
		const attachment = await new AttachmentService(account, device).delete(id);
		const path = __basedir + Path.Media + attachment;
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

async function attachmentById(req: Request, res: Response, next: NextFunction) {
	const { account, device, id } = req.locals;

	try {
		const attachment = await new AttachmentService(account, device).getAttachment(id);
		return Respond({
			res,
			status: 200,
			data: {
				attachment,
			},
		});
	} catch (err: unknown) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function listAttachments(req: Request, res: Response, next: NextFunction) {
	const { account, device } = req.locals;

	const attachments = await new AttachmentService(account, device).listAttachments();
	return Respond({
		res,
		status: 200,
		data: {
			attachments,
		},
	});
}

const Controller = {
	addAttachment,
	downloadAttachment,
	deleteAttachment,
	attachmentById,
	listAttachments,
};

export default Controller;
