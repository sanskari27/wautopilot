import express from 'express';
import Controller from './uploads.controller';

const router = express.Router();

router.route('/upload-meta-handle').post(Controller.upload);

export default router;
