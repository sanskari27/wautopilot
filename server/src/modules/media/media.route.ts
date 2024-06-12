import express from 'express';
import Controller from './media.controller';

const router = express.Router();

router.route('/:id/download').get(Controller.downloadAttachment);

router.route('/:id').get(Controller.attachmentById).delete(Controller.deleteAttachment);

router.route('/').post(Controller.addAttachment).get(Controller.listAttachments);

export default router;
