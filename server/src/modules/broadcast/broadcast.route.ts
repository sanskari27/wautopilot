import express from 'express';
import { Permissions } from '../../config/const';
import { IDValidator } from '../../middleware';
import VerifyPermissions from '../../middleware/VerifyPermissions';
import Controller from './broadcast.controller';
import { CreateBroadcastValidator, CreateRecurringValidator } from './broadcast.validator';

const router = express.Router();

// ------------------------------------------Recurring------------------------------------------

router
	.route('/recurring/:id/reschedule')
	.all(IDValidator, VerifyPermissions(Permissions.recurring.update))
	.post(Controller.rescheduleRecurringBroadcast);

router
	.route('/recurring/:id/toggle')
	.all(IDValidator, VerifyPermissions(Permissions.recurring.update))
	.post(Controller.toggleRecurringBroadcast);

router
	.route('/recurring/:id')
	.all(IDValidator)
	.get(VerifyPermissions(Permissions.recurring.export), Controller.fetchRecurringBroadcast)
	.delete(VerifyPermissions(Permissions.recurring.delete), Controller.deleteRecurringBroadcast)
	.put(
		VerifyPermissions(Permissions.recurring.update),
		CreateRecurringValidator,
		Controller.updateRecurringBroadcast
	);

router
	.route('/recurring')
	.get(Controller.listRecurringBroadcasts)
	.post(
		VerifyPermissions(Permissions.recurring.create),
		CreateRecurringValidator,
		Controller.scheduleRecurringBroadcast
	);

// -----------------------------------------------------------------------------------
router
	.route('/reports')
	.all(VerifyPermissions(Permissions.broadcast.report))
	.get(Controller.broadcastReport);

router
	.route('/send')
	.all(VerifyPermissions(Permissions.broadcast.create), CreateBroadcastValidator)
	.post(Controller.sendTemplateMessage);
router
	.route('/:id/pause')
	.all(VerifyPermissions(Permissions.broadcast.update), IDValidator)
	.post(Controller.pauseBroadcast);
router
	.route('/:id/resume')
	.all(VerifyPermissions(Permissions.broadcast.update), IDValidator)
	.post(Controller.resumeBroadcast);
router
	.route('/:id/delete')
	.all(VerifyPermissions(Permissions.broadcast.update), IDValidator)
	.post(Controller.deleteBroadcast);
router
	.route('/:id/resend')
	.all(VerifyPermissions(Permissions.broadcast.update), IDValidator)
	.post(Controller.resendBroadcast);
router
	.route('/:id/download')
	.all(VerifyPermissions(Permissions.broadcast.export), IDValidator)
	.get(Controller.downloadBroadcast);

router
	.route('/:id/button-responses')
	.all(VerifyPermissions(Permissions.buttons.read), IDValidator)
	.get(Controller.buttonResponses);

export default router;
