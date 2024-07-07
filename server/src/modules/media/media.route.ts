import express from 'express';
import { Permissions } from '../../config/const';
import { IDValidator } from '../../middleware';
import VerifyPermissions from '../../middleware/VerifyPermissions';
import Controller from './media.controller';

const router = express.Router();

router.route('/:id/download').all(IDValidator).get(Controller.downloadMedia);

router
	.route('/:id')
	.all(IDValidator)
	.get(Controller.mediaById)
	.delete(VerifyPermissions(Permissions.media.delete), Controller.deleteMedia);

router
	.route('/')
	.get(Controller.listMedia)
	.post(VerifyPermissions(Permissions.media.create), Controller.addMedia);

export default router;
