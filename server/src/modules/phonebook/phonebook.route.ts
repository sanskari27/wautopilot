import express from 'express';
import { IDValidator } from '../../middleware';
import Controller from './phonebook.controller';
import { LabelValidator, RecordUpdateValidator, RecordsValidator } from './phonebook.validator';

const router = express.Router();

router.route('/all-labels').get(Controller.getAllLabels);

router.route('/set-labels/:id').all(IDValidator, LabelValidator).post(Controller.setLabels);

router.route('/bulk-upload').post(Controller.bulkUpload);

router.route('/').get(Controller.records).all(RecordsValidator).post(Controller.addRecords);

router
	.route('/:id')
	.all(IDValidator)
	.delete(Controller.deleteRecords)
	.all(RecordUpdateValidator)
	.put(Controller.updateRecords);

export default router;
