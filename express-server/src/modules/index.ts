import express from 'express';
import SessionRoute from './session/session.route';

import { CustomError, ERRORS } from '../errors';
import PhonePeProvider from '../provider/phonepe';
import { Respond, RespondFile } from '../utils/ExpressUtils';
import { FileUpload, ONLY_MEDIA_ALLOWED, SingleFileUploadOptions } from '../utils/files';

const router = express.Router();

// Next routes will be webhooks routes

router.use('/sessions', SessionRoute);

router.use('/phonepe/callback', PhonePeProvider.Callbacks.transactionCallback);

router.post('/upload-media', async function (req, res, next) {
	const fileUploadOptions: SingleFileUploadOptions = {
		field_name: 'file',
		options: {
			fileFilter: ONLY_MEDIA_ALLOWED,
		},
	};

	try {
		const uploadedFile = await FileUpload.SingleFileUpload(req, res, fileUploadOptions);
		return Respond({
			res,
			status: 200,
			data: {
				name: uploadedFile.filename,
			},
		});
	} catch (err: unknown) {
		return next(new CustomError(ERRORS.FILE_UPLOAD_ERROR, err));
	}
});

router.get('/media/:path/:filename', async function (req, res, next) {
	try {
		const path = __basedir + '/static/' + req.params.path + '/' + req.params.filename;
		return RespondFile({
			res,
			filename: req.params.filename,
			filepath: path,
		});
	} catch (err: unknown) {
		return next(new CustomError(ERRORS.NOT_FOUND));
	}
});

export default router;
