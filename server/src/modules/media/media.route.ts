import express from 'express';
import { Permissions } from '../../config/const';
import { IDValidator } from '../../middleware';
import VerifyPermissions from '../../middleware/VerifyPermissions';
import Controller from './media.controller';

const router = express.Router();

const mediaPermission = VerifyPermissions(Permissions.manage_media);

router.route('/:id/download').all(IDValidator).get(Controller.downloadMedia);

router
	.route('/:id')
	.all(mediaPermission, IDValidator)
	.get(Controller.mediaById)
	.delete(Controller.deleteMedia);

router.route('/').get(Controller.listMedia).all(mediaPermission).post(Controller.addMedia);

export default router;
