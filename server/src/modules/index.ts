import express from 'express';
import SessionRoute from './auth/auth.route';
import MessageRoute from './message/message.route';
import PhonebookRoute from './phonebook/phonebook.route';
import TemplateRoute from './template/template.route';
import WhatsappLinkRoute from './whatsapp-link/whatsappLink.route';

import FileUpload, { ONLY_MEDIA_ALLOWED, SingleFileUploadOptions } from '../config/FileUpload';
import { CustomError, ERRORS } from '../errors';
import { VerifyDevice, VerifySession } from '../middleware';
import PhonePeProvider from '../provider/phonepe';
import { Respond, RespondFile } from '../utils/ExpressUtils';

const router = express.Router();

// Next routes will be webhooks routes

router.use('/sessions', SessionRoute);
router.use('/phonebook', VerifySession, PhonebookRoute);
router.use('/whatsapp-link', VerifySession, WhatsappLinkRoute);
router.use('/template/:device_id', VerifySession, VerifyDevice, TemplateRoute);
router.use('/message/:device_id', VerifySession, VerifyDevice, MessageRoute);

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

router.post('/webhooks/meta/whatsapp', async function (req, res) {
	return res.status(200).send('OK');
});

router.get('/webhooks/meta/whatsapp', async function (req, res) {
	const mode = req.query['hub.mode'];
	const challenge = req.query['hub.challenge'];
	const token = req.query['hub.verify_token'];

	if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_TOKEN) {
		return res.status(200).send(challenge);
	}
	return res.status(403).send('Forbidden');
});

export default router;
