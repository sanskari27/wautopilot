import express from 'express';
import { Permissions } from '../../config/const';
import { IDValidator } from '../../middleware';
import VerifyPermissions from '../../middleware/VerifyPermissions';
import Controller from './media.controller';

const router = express.Router();

const contactsPermission = VerifyPermissions(Permissions.manage_contacts);

router.route('/:id/download').all(contactsPermission, IDValidator).get(Controller.downloadMedia);

router
	.route('/:id')
	.all(contactsPermission, IDValidator)
	.get(Controller.mediaById)
	.delete(Controller.deleteMedia);

router.route('/').all(contactsPermission).post(Controller.addMedia).get(Controller.listMedia);

export default router;
