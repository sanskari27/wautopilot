import express from 'express';
import { IDValidator } from '../../middleware';
import Controller from './message.controller';
import { LabelValidator, SendMessageValidator } from './message.validator';

const router = express.Router();

router
	.route('/conversations/:id/messages')
	.all(IDValidator)
	.get(Controller.fetchConversationMessages);

router
	.route('/conversations/:id/send-message')
	.all(IDValidator, SendMessageValidator)
	.post(Controller.sendMessageToConversation);

router
	.route('/message/:id/assign-labels')
	.all(IDValidator, LabelValidator)
	.post(Controller.assignLabelToMessage);
router.route('/mark-read/:message_id').post(Controller.markRead);

router.route('/conversations').get(Controller.fetchConversations);

export default router;
