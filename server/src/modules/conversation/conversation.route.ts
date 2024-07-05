import express from 'express';
import { IDValidator } from '../../middleware';
import Controller from './conversation.controller';
import { LabelValidator, SendMessageValidator } from './conversation.validator';

const router = express.Router();

router.route('/:id/messages').all(IDValidator).get(Controller.fetchConversationMessages);

router
	.route('/:id/send-message')
	.all(IDValidator, SendMessageValidator)
	.post(Controller.sendMessageToConversation);

router
	.route('/message/:id/assign-labels')
	.all(IDValidator, LabelValidator)
	.post(Controller.assignLabelToMessage);
router.route('/mark-read/:message_id').post(Controller.markRead);

// router
// 	.route('/:id/assign-agent/:agent_id')
// 	.all(IDValidator, AgentValidator)
// 	.post(Controller.assignConversationToAgent);

router.route('/').get(Controller.fetchConversations);

export default router;
