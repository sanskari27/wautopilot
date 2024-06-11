import express from 'express';
import Controller from './message.controller';
import { CreateBroadcastValidator } from './message.validator';

const router = express.Router();

router.route('/send-broadcast').all(CreateBroadcastValidator).post(Controller.sendTemplateMessage);
router.route('/conversations').get(Controller.fetchConversations);

// router
// 	.route('/:id/schedule-template')
// 	.all(VerifySession, IDValidator, SendTemplateMessage)
// 	.post(Controller.sendTemplateMessage);

export default router;
