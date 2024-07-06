import express from 'express';
import { UserLevel } from '../../config/const';
import { IDValidator, VerifyMinLevel } from '../../middleware';
import Controller from './shortener.controller';
import { LinkValidator } from './shortener.validator';

const router = express.Router();

router.route('/open/:id').get(Controller.open);

router
	.route('/:id')
	.all(IDValidator, VerifyMinLevel(UserLevel.Admin))
	.patch(LinkValidator, Controller.updateLink)
	.delete(Controller.deleteLink);

router
	.route('/')
	.all(VerifyMinLevel(UserLevel.Admin))
	.get(Controller.listAll)
	.post(LinkValidator, Controller.createLink);

export default router;
