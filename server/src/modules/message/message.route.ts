import express from 'express';
import { IDValidator } from '../../middleware';
import Controller from './message.controller';
import { CreateBroadcastValidator, SendMessageValidator } from './message.validator';

const router = express.Router();

router.route('/broadcast/report').get(Controller.broadcastReport);
router.route('/broadcast/send-broadcast').all(CreateBroadcastValidator).post(Controller.sendTemplateMessage);

router.route('/conversations').get(Controller.fetchConversations);
router
	.route('/conversations/:id/messages')
	.all(IDValidator)
	.get(Controller.fetchConversationMessages);

router
	.route('/conversations/:id/send-message')
	.all(IDValidator, SendMessageValidator)
	.post(Controller.sendMessageToConversation);

router.route('/mark-read/:message_id').post(Controller.markRead);

// router
// 	.route('/:id/schedule-template')
// 	.all(VerifySession, IDValidator, SendTemplateMessage)
// 	.post(Controller.sendTemplateMessage);

export default router;
