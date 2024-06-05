import express from 'express';
import { IDValidator, VerifySession } from '../../middleware';
import Controller from './message.controller';
import { SendTemplateMessage } from './message.validator';

const router = express.Router();

router
	.route('/:id/send-template')
	.all(VerifySession, IDValidator, SendTemplateMessage)
	.post(Controller.sendTemplateMessage);

// router
// 	.route('/:id/schedule-template')
// 	.all(VerifySession, IDValidator, SendTemplateMessage)
// 	.post(Controller.sendTemplateMessage);

export default router;
