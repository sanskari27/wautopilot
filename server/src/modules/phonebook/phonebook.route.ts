import express from 'express';
import { IDValidator } from '../../middleware';
import Controller from './phonebook.controller';
import {
	LabelValidator,
	MultiDeleteValidator,
	RecordUpdateValidator,
	RecordsValidator,
} from './phonebook.validator';

const router = express.Router();

router.route('/all-labels').get(Controller.getAllLabels);

router.route('/set-labels').all(LabelValidator).post(Controller.setLabels);
router.route('/add-labels').all(LabelValidator).post(Controller.addLabels);
router.route('/remove-labels').all(LabelValidator).post(Controller.removeLabels);

router.route('/bulk-upload').post(Controller.bulkUpload);

router.route('/delete-multiple').all(MultiDeleteValidator).post(Controller.deleteMultiple);
router.route('/export').get(Controller.exportRecords);
router.route('/').get(Controller.records).all(RecordsValidator).post(Controller.addRecords);

router
	.route('/:id')
	.all(IDValidator)
	.delete(Controller.deleteRecords)
	.all(RecordUpdateValidator)
	.put(Controller.updateRecords);

export default router;
