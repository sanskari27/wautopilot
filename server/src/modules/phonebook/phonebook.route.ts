import express from 'express';
import { IDValidator, VerifySession } from '../../middleware';
import Controller from './phonebook.controller';
import { LabelValidator, RecordUpdateValidator, RecordsValidator } from './phonebook.validator';

const router = express.Router();

router.route('/all-labels').all(VerifySession).get(Controller.getAllLabels);
router
	.route('/set-labels/:id')
	.all(VerifySession, IDValidator, LabelValidator)
	.post(Controller.setLabels);

router.route('/bulk-upload').all(VerifySession).post(Controller.bulkUpload);

router
	.route('/')
	.all(VerifySession)
	.get(Controller.records)
	.all(RecordsValidator)
	.post(Controller.addRecords);

router
	.route('/:id')
	.all(VerifySession, IDValidator)
	.delete(Controller.deleteRecords)
	.all(RecordUpdateValidator)
	.put(Controller.updateRecords);

export default router;
