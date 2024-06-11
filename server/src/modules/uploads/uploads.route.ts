import express from 'express';
import Controller from './uploads.controller';

const router = express.Router();

router.route('/upload-meta-handle').post(Controller.uploadMetaHandle);
router.route('/upload-meta-media').post(Controller.uploadMetaMedia);
router.route('/meta-media-url/:id').get(Controller.fetchMetaMediaUrl);

export default router;
