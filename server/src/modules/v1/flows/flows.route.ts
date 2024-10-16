import express from 'express';
import Controller from './flows.controller';

const router = express.Router();

router.route('/:id').get(Controller.getWhatsappFlowAssets);

router.route('/').get(Controller.listWhatsappFlows);

export default router;
