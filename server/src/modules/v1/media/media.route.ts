import express from 'express';
import Controller from './media.controller';

const router = express.Router();

router.route('/:id/download').get(Controller.downloadMedia);

router.route('/').get(Controller.listMedia);

export default router;
