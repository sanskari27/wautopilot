import express from 'express';
import { IDValidator, VerifySession } from '../../middleware';
import Controller from './template.controller';
import { TemplateCreateValidator, TemplateRemoveValidator } from './template.validator';

const router = express.Router();

router
	.route('/:id/add-template')
	.all(VerifySession, IDValidator, TemplateCreateValidator)
	.post(Controller.addTemplate);

router
	.route('/:id/delete-template')
	.all(VerifySession, IDValidator, TemplateRemoveValidator)
	.post(Controller.deleteTemplate);

router.route('/:id/').all(VerifySession, IDValidator).get(Controller.fetchTemplates);

export default router;
