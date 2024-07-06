import express from 'express';
import { Permissions } from '../../config/const';
import { IDValidator } from '../../middleware';
import VerifyPermissions from '../../middleware/VerifyPermissions';
import Controller from './contacts.controller';
import { CreateContactValidator, MultiDeleteValidator } from './contacts.validator';

const router = express.Router();
const contactsPermission = VerifyPermissions(Permissions.manage_contacts);

router
	.route('/:id')
	.all(contactsPermission, IDValidator)
	.put(CreateContactValidator, Controller.updateContact);

router
	.route('/')
	.get(Controller.getContacts)
	.all(contactsPermission)
	.delete(MultiDeleteValidator, Controller.deleteContact)
	.post(CreateContactValidator, Controller.createContact);

export default router;
