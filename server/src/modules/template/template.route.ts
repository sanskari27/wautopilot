import express from 'express';
import { Permissions } from '../../config/const';
import VerifyPermissions from '../../middleware/VerifyPermissions';
import Controller from './template.controller';
import {
	TemplateCreateValidator,
	TemplateEditValidator,
	TemplateRemoveValidator,
} from './template.validator';

const router = express.Router();

router
	.route('/add-template')
	.all(VerifyPermissions(Permissions.create_template), TemplateCreateValidator)
	.post(Controller.addTemplate);

router
	.route('/edit-template')
	.all(VerifyPermissions(Permissions.update_template), TemplateEditValidator)
	.post(Controller.editTemplate);

router
	.route('/delete-template')
	.all(VerifyPermissions(Permissions.delete_template), TemplateRemoveValidator)
	.post(Controller.deleteTemplate);

router.route('/:id').get(Controller.fetchTemplate);
router.route('/').get(Controller.fetchTemplates);

export default router;
