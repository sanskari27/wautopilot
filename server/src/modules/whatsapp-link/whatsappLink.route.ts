import express from 'express';
import { IDValidator, VerifySession } from '../../middleware';
import Controller from './whatsappLink.controller';
import { WhatsappLinkCreateValidator } from './whatsappLink.validator';

const router = express.Router();

router
	.route('/link-device')
	.all(VerifySession, WhatsappLinkCreateValidator)
	.post(Controller.linkDevice);
router.route('/linked-devices').all(VerifySession).get(Controller.getAllLinkedDevices);
router.route('/remove-device/:id').all(VerifySession, IDValidator).post(Controller.removeDevice);

export default router;
