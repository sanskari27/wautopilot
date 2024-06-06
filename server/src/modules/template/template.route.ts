import express from 'express';
import Controller from './template.controller';
import {
	TemplateCreateValidator,
	TemplateEditValidator,
	TemplateRemoveValidator,
} from './template.validator';

const router = express.Router();

router.route('/add-template').all(TemplateCreateValidator).post(Controller.addTemplate);

router.route('/edit-template').all(TemplateEditValidator).post(Controller.editTemplate);

router.route('/delete-template').all(TemplateRemoveValidator).post(Controller.deleteTemplate);

router.route('/').get(Controller.fetchTemplates);

export default router;
