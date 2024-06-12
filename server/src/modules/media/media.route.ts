import express from 'express';
import { IDValidator } from '../../middleware';
import Controller from './media.controller';

const router = express.Router();

router.route('/:id/download').all(IDValidator).get(Controller.downloadMedia);

router.route('/:id').all(IDValidator).get(Controller.mediaById).delete(Controller.deleteMedia);

router.route('/').post(Controller.addMedia).get(Controller.listMedia);

export default router;
