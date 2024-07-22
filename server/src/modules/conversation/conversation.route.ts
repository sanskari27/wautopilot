import express from 'express';
import { AgentValidator, IDValidator } from '../../middleware';
import { IDsValidator } from '../../middleware/idValidator';
import Controller from './conversation.controller';
import { LabelValidator, NumbersValidator, SendMessageValidator } from './conversation.validator';

const router = express.Router();

router
	.route('/message/:id/assign-labels')
	.all(IDValidator, LabelValidator)
	.post(Controller.assignLabelToMessage);
router.route('/mark-read/:message_id').post(Controller.markRead);

router
	.route('/assign-agent/:agent_id')
	.all(AgentValidator, NumbersValidator)
	.post(Controller.bulkAssignConversationToAgent);

router
	.route('/transfer-agent/:agent_id/:id')
	.all(AgentValidator)
	.post(Controller.transferAgentConversation);

router
	.route('/export-from-phonebook')
	.all(IDsValidator)
	.post(Controller.exportConversationsFromPhonebook);

router.route('/:id/messages').all(IDValidator).get(Controller.fetchConversationMessages);

router.route('/:id/note').all(IDValidator).post(Controller.addNote).get(Controller.getNote);

router
	.route('/:id/send-message')
	.all(IDValidator, SendMessageValidator)
	.post(Controller.sendMessageToConversation);

router
	.route('/:id/assign-agent/:agent_id')
	.all(IDValidator, AgentValidator)
	.post(Controller.assignConversationToAgent);

router.route('/:id/remove-agent').all(IDValidator).post(Controller.removeConversationFromAgent);

router.route('/').get(Controller.fetchConversations);

export default router;
