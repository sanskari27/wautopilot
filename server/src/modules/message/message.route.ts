import express from 'express';
import { IDValidator } from '../../middleware';
import Controller from './message.controller';
import {
	CreateBroadcastValidator,
	LabelValidator,
	SendMessageValidator,
} from './message.validator';

const router = express.Router();

router.route('/broadcast/reports').get(Controller.broadcastReport);
router.route('/broadcast/:id/pause').all(IDValidator).post(Controller.pauseBroadcast);
router.route('/broadcast/:id/resume').all(IDValidator).post(Controller.resumeBroadcast);
router.route('/broadcast/:id/delete').all(IDValidator).post(Controller.deleteBroadcast);
router.route('/broadcast/:id/resend').all(IDValidator).post(Controller.resendBroadcast);
router.route('/broadcast/:id/download').all(IDValidator).get(Controller.downloadBroadcast);

router
	.route('/broadcast/send-broadcast')
	.all(CreateBroadcastValidator)
	.post(Controller.sendTemplateMessage);

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
