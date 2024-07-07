import express from 'express';
import { Permissions } from '../../config/const';
import { IDValidator } from '../../middleware';
import VerifyPermissions from '../../middleware/VerifyPermissions';
import Controller from './contacts.controller';
import { CreateContactValidator, MultiDeleteValidator } from './contacts.validator';

const router = express.Router();

router
	.route('/:id')
	.all(VerifyPermissions(Permissions.contacts.update), IDValidator)
	.put(CreateContactValidator, Controller.updateContact);

router
	.route('/')
	.get(Controller.getContacts)
	.delete(
		VerifyPermissions(Permissions.contacts.delete),
		MultiDeleteValidator,
		Controller.deleteContact
	)
	.post(
		VerifyPermissions(Permissions.contacts.create),
		CreateContactValidator,
		Controller.createContact
	);

export default router;
