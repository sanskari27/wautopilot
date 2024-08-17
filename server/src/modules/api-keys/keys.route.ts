import express from 'express';
import { IDValidator } from '../../middleware';
import Controller from './keys.controller';
import { CreateAPIKeyValidator } from './keys.validator';

const router = express.Router();

router.route('/:id/regenerate-token').all(IDValidator).post(Controller.regenerateToken);
router.route('/:id').all(IDValidator).delete(Controller.deleteAPIKey);
router.route('/').get(Controller.listKeys).post(CreateAPIKeyValidator, Controller.createAPIKey);

export default router;
