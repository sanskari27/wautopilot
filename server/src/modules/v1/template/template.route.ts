import express from 'express';
import Controller from './template.controller';

const router = express.Router();

router.route('/:id').get(Controller.fetchTemplate);
router.route('/').get(Controller.fetchTemplates);

export default router;
