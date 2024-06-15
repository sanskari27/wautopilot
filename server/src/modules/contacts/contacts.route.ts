import express from 'express';
import { IDValidator } from '../../middleware';
import Controller from './contacts.controller';
import { CreateContactValidator, MultiDeleteValidator } from './contacts.validator';

const router = express.Router();

router.route('/:id').all(IDValidator).put(CreateContactValidator, Controller.updateContact);

router
	.route('/')
	.get(Controller.getContacts)
	.delete(MultiDeleteValidator, Controller.deleteContact)
	.post(CreateContactValidator, Controller.createContact);

export default router;
