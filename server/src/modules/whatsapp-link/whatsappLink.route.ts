import express from 'express';
import { Permissions } from '../../config/const';
import { IDValidator, VerifyDevice } from '../../middleware';
import VerifyPermissions from '../../middleware/VerifyPermissions';
import Controller from './whatsappLink.controller';
import { WhatsappLinkCreateValidator } from './whatsappLink.validator';

const router = express.Router();

router
	.route('/link-device')
	.all(VerifyPermissions(Permissions.Devices), WhatsappLinkCreateValidator)
	.post(Controller.linkDevice);

router.route('/linked-devices').get(Controller.getAllLinkedDevices);
router.route('/remove-device/:id').all(IDValidator).post(Controller.removeDevice);
router.route('/message-health/:device_id').all(VerifyDevice).get(Controller.fetchMessageHealth);

export default router;
