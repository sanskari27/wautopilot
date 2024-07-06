import express from 'express';
import { IDValidator } from '../../middleware';
import Controller from './shortener.controller';
import { LinkValidator } from './shortener.validator';

const router = express.Router();

router.route('/open/:id').get(Controller.open);

router
	.route('/:id')
	.all(IDValidator)
	.patch(LinkValidator, Controller.updateLink)
	.delete(Controller.deleteLink);

router.route('/').get(Controller.listAll).post(LinkValidator, Controller.createLink);

export default router;
