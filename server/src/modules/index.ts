import express from 'express';
import SessionRoute from './auth/auth.route';
import BroadcastRoute from './broadcast/broadcast.route';
import ChatBotRoute from './chatbot/chatbot.route';
import ContactsRoute from './contacts/contacts.route';
import ConversationRoute from './conversation/conversation.route';
import CouponRoute from './coupon/coupon.route';
import ExtrasRoute from './extras/extras.route';
import MediaRoute from './media/media.route';
import OverviewRoute from './overview/overview.route';
import PaymentRoute from './payment/payment.route';
import PhonebookRoute from './phonebook/phonebook.route';
import ShortenerRoute from './shortener/shortener.route';
import TemplateRoute from './template/template.route';
import UploadsRoute from './uploads/uploads.route';
import UsersRoute from './users/users.route';
import WebhooksRoute from './webhooks/webhooks.route';
import WhatsappLinkRoute from './whatsapp-link/whatsappLink.route';

import FileUpload, { ONLY_MEDIA_ALLOWED, SingleFileUploadOptions } from '../config/FileUpload';
import { CustomError, ERRORS } from '../errors';
import { VerifyDevice, VerifySession } from '../middleware';
import SocketServer from '../socket';
import { Respond, RespondFile, generateRandomID } from '../utils/ExpressUtils';

const router = express.Router();

// Next routes will be webhooks routes

router.use('/sessions', SessionRoute);
router.use('/contacts', VerifySession, ContactsRoute);
router.use('/phonebook', VerifySession, PhonebookRoute);
router.use('/coupon', VerifySession, CouponRoute);
router.use('/whatsapp-link', VerifySession, WhatsappLinkRoute);
router.use('/payment', VerifySession, PaymentRoute);
router.use('/shortener', VerifySession, ShortenerRoute);

router.use('/:device_id/overview', VerifySession, VerifyDevice, OverviewRoute);
router.use('/:device_id/template', VerifySession, VerifyDevice, TemplateRoute);
router.use('/:device_id/broadcast', VerifySession, VerifyDevice, BroadcastRoute);
router.use('/:device_id/conversation', VerifySession, VerifyDevice, ConversationRoute);
router.use('/:device_id/chatbot', VerifySession, VerifyDevice, ChatBotRoute);
router.use('/:device_id/media', VerifySession, VerifyDevice, MediaRoute);
router.use('/:device_id/uploads', VerifySession, VerifyDevice, UploadsRoute);
router.use('/users', VerifySession, UsersRoute);
router.use('/extras', ExtrasRoute);
router.use('/webhooks', WebhooksRoute);

router
	.route('/conversation-message-key')
	.all(VerifySession)
	.post(async function (req, res, next) {
		const key = generateRandomID();

		SocketServer.getInstance().addConversationKey(key, req.locals.serviceUser.userId.toString());
		Respond({
			res,
			status: 200,
			data: {
				key,
			},
		});
	});

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
