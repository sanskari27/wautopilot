import express from 'express';
import { IDValidator } from '../../middleware';
import Controller from './broadcast.controller';
import { CreateBroadcastValidator, CreateRecurringValidator } from './broadcast.validator';

const router = express.Router();

// ------------------------------------------Recurring------------------------------------------

router
	.route('/recurring/:id/reschedule')
	.all(IDValidator)
	.post(Controller.rescheduleRecurringBroadcast);

router.route('/recurring/:id/toggle').all(IDValidator).post(Controller.toggleRecurringBroadcast);

router
	.route('/recurring/:id')
	.all(IDValidator)
	.get(Controller.fetchRecurringBroadcast)
	.delete(Controller.deleteRecurringBroadcast)
	.put(CreateRecurringValidator, Controller.updateRecurringBroadcast);

router
	.route('/recurring')
	.get(Controller.listRecurringBroadcasts)
	.post(CreateRecurringValidator, Controller.scheduleRecurringBroadcast);

// -----------------------------------------------------------------------------------
router.route('/reports').get(Controller.broadcastReport);
router.route('/send').all(CreateBroadcastValidator).post(Controller.sendTemplateMessage);
router.route('/:id/pause').all(IDValidator).post(Controller.pauseBroadcast);
router.route('/:id/resume').all(IDValidator).post(Controller.resumeBroadcast);
router.route('/:id/delete').all(IDValidator).post(Controller.deleteBroadcast);
router.route('/:id/resend').all(IDValidator).post(Controller.resendBroadcast);
router.route('/:id/download').all(IDValidator).get(Controller.downloadBroadcast);

router.route('/:id/button-responses').all(IDValidator).get(Controller.buttonResponses);

export default router;
