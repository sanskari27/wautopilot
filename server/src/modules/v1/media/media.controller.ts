import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../../../errors';
import COMMON_ERRORS from '../../../errors/common-errors';
import MediaService from '../../../services/media';
import { Respond, RespondFile } from '../../../utils/ExpressUtils';
import FileUtils from '../../../utils/FileUtils';

async function downloadMedia(req: Request, res: Response, next: NextFunction) {
	const {
		serviceAccount: account,
		device: { device },
	} = req.locals;
	try {
		let path = await new MediaService(account, device).getLocalPathByMediaId(req.params.id);
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
			list: list.map((media) => ({
				id: media.media_id,
				filename: media.filename,
				file_length: media.file_length,
				mime_type: media.mime_type,
			})),
		},
	});
}

const Controller = {
	downloadMedia,
	listMedia,
};

export default Controller;
