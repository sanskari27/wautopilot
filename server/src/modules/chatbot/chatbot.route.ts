import express from 'express';
import { IDValidator } from '../../middleware';
import Controller from './chatbot.controller';
import { CreateBotValidator, CreateFlowValidator, UpdateFlowValidator } from './chatbot.validator';

const router = express.Router();

router
	.route('/flows/:id')
	.all(IDValidator)
	.get(Controller.chatBotFlowDetails)
	.delete(Controller.deleteFlow)
	.put(Controller.toggleActiveFlow)
	.patch(UpdateFlowValidator, Controller.updateFlow);

router.route('/flows').get(Controller.listFlows).post(CreateFlowValidator, Controller.createFlow);

router.route('/:id/download-response').all(IDValidator).get(Controller.downloadResponses);

router
	.route('/:id')
	.all(IDValidator)
	.delete(Controller.deleteBot)
	.put(Controller.toggleActive)
	.patch(CreateBotValidator, Controller.updateBot);

router.route('/').get(Controller.listBots).post(CreateBotValidator, Controller.createBot);

export default router;
