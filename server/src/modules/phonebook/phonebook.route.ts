import express from 'express';
import { Permissions } from '../../config/const';
import { IDValidator } from '../../middleware';
import VerifyPermissions from '../../middleware/VerifyPermissions';
import Controller from './phonebook.controller';
import {
	LabelValidator,
	MultiDeleteValidator,
	RecordUpdateValidator,
	RecordsValidator,
} from './phonebook.validator';

const router = express.Router();

router.route('/all-labels').get(Controller.getAllLabels);

router
	.route('/set-labels/phone/:phone_number')
	.all(VerifyPermissions(Permissions.phonebook.update), LabelValidator)
	.post(Controller.setLabelsByPhone);
router
	.route('/set-labels')
	.all(VerifyPermissions(Permissions.phonebook.update), LabelValidator)
	.post(Controller.setLabels);
router
	.route('/add-labels')
	.all(VerifyPermissions(Permissions.phonebook.update), LabelValidator)
	.post(Controller.addLabels);
router
	.route('/remove-labels')
	.all(VerifyPermissions(Permissions.phonebook.update), LabelValidator)
	.post(Controller.removeLabels);

router
	.route('/bulk-upload')
	.post(VerifyPermissions(Permissions.phonebook.create), Controller.bulkUpload);

router
	.route('/delete-multiple')
	.all(VerifyPermissions(Permissions.phonebook.delete), MultiDeleteValidator)
	.post(Controller.deleteMultiple);

router
	.route('/export')
	.get(VerifyPermissions(Permissions.phonebook.export), Controller.exportRecords);

router
	.route('/:id')
	.all(IDValidator)
	.delete(VerifyPermissions(Permissions.phonebook.delete), Controller.deleteRecords)
	.put(
		VerifyPermissions(Permissions.phonebook.update),
		RecordUpdateValidator,
		Controller.updateRecords
	);

router
	.route('/')
	.get(Controller.records)
	.all(RecordsValidator)
	.post(VerifyPermissions(Permissions.phonebook.create), Controller.addRecords);

export default router;
