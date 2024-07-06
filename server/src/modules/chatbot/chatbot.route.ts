import express from 'express';
import { Permissions } from '../../config/const';
import { IDValidator } from '../../middleware';
import VerifyPermissions from '../../middleware/VerifyPermissions';
import Controller from './chatbot.controller';
import { CreateBotValidator, CreateFlowValidator, UpdateFlowValidator } from './chatbot.validator';

const router = express.Router();

const chatbotPermission = VerifyPermissions(Permissions.manage_chatbot);
const chatbotFlowPermission = VerifyPermissions(Permissions.manage_chatbot_flows);

router
	.route('/flows/:id')
	.all(IDValidator, chatbotFlowPermission)
	.get(Controller.chatBotFlowDetails)
	.delete(Controller.deleteFlow)
	.put(Controller.toggleActiveFlow)
	.patch(UpdateFlowValidator, Controller.updateFlow);

router
	.route('/flows')
	.all(chatbotFlowPermission)
	.get(Controller.listFlows)
	.post(CreateFlowValidator, Controller.createFlow);

router
	.route('/:id/download-response')
	.all(chatbotPermission, IDValidator)
	.get(Controller.downloadResponses);

router
	.route('/:id')
	.all(chatbotPermission, IDValidator)
	.delete(Controller.deleteBot)
	.put(Controller.toggleActive)
	.patch(CreateBotValidator, Controller.updateBot);

router
	.route('/')
	.all(chatbotPermission)
	.get(Controller.listBots)
	.post(CreateBotValidator, Controller.createBot);

export default router;
