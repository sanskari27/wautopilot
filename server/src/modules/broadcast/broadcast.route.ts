import express from 'express';
import { Permissions } from '../../config/const';
import { IDValidator } from '../../middleware';
import VerifyPermissions from '../../middleware/VerifyPermissions';
import Controller from './broadcast.controller';
import { CreateBroadcastValidator, CreateRecurringValidator } from './broadcast.validator';

const router = express.Router();

// ------------------------------------------Recurring------------------------------------------

const recurringPermission = VerifyPermissions(Permissions.create_recurring_broadcast);
const createBroadcastPermission = VerifyPermissions(Permissions.create_broadcast);
const viewBroadcastPermission = VerifyPermissions(Permissions.view_broadcast_reports);

router
	.route('/recurring/:id/reschedule')
	.all(IDValidator, recurringPermission)
	.post(Controller.rescheduleRecurringBroadcast);

router
	.route('/recurring/:id/toggle')
	.all(IDValidator, recurringPermission)
	.post(Controller.toggleRecurringBroadcast);

router
	.route('/recurring/:id')
	.all(IDValidator, recurringPermission)
	.get(Controller.fetchRecurringBroadcast)
	.delete(Controller.deleteRecurringBroadcast)
	.put(CreateRecurringValidator, Controller.updateRecurringBroadcast);

router
	.route('/recurring')
	.all(recurringPermission)
	.get(Controller.listRecurringBroadcasts)
	.post(CreateRecurringValidator, Controller.scheduleRecurringBroadcast);

// -----------------------------------------------------------------------------------
router.route('/reports').all(viewBroadcastPermission).get(Controller.broadcastReport);
router
	.route('/send')
	.all(createBroadcastPermission, CreateBroadcastValidator)
	.post(Controller.sendTemplateMessage);
router
	.route('/:id/pause')
	.all(createBroadcastPermission, IDValidator)
	.post(Controller.pauseBroadcast);
router
	.route('/:id/resume')
	.all(createBroadcastPermission, IDValidator)
	.post(Controller.resumeBroadcast);
router
	.route('/:id/delete')
	.all(createBroadcastPermission, IDValidator)
	.post(Controller.deleteBroadcast);
router
	.route('/:id/resend')
	.all(createBroadcastPermission, IDValidator)
	.post(Controller.resendBroadcast);
router
	.route('/:id/download')
	.all(createBroadcastPermission, IDValidator)
	.get(Controller.downloadBroadcast);

router
	.route('/:id/button-responses')
	.all(viewBroadcastPermission, IDValidator)
	.get(Controller.buttonResponses);

export default router;
