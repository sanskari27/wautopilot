import express from 'express';
import { IDValidator } from '../../middleware';
import Controller from './whatsappLink.controller';
import { WhatsappLinkCreateValidator } from './whatsappLink.validator';

const router = express.Router();

router.route('/link-device').all(WhatsappLinkCreateValidator).post(Controller.linkDevice);

router.route('/linked-devices').get(Controller.getAllLinkedDevices);
router.route('/remove-device/:id').all(IDValidator).post(Controller.removeDevice);
router.route('/current-device/:id').all(IDValidator).get(Controller.setCurrentDevice);
router.route('/message-health/:id').all(IDValidator).get(Controller.fetchMessageHealth);

export default router;
