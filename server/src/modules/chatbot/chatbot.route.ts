import express from 'express';
import { Permissions } from '../../config/const';
import { IDValidator } from '../../middleware';
import VerifyPermissions from '../../middleware/VerifyPermissions';
import Controller from './chatbot.controller';
import { CreateBotValidator, CreateFlowValidator, UpdateFlowValidator } from './chatbot.validator';

const router = express.Router();

router
	.route('/flows/:id')
	.all(IDValidator)
	.get(Controller.chatBotFlowDetails)
	.delete(VerifyPermissions(Permissions.chatbot_flow.delete), Controller.deleteFlow)
	.put(VerifyPermissions(Permissions.chatbot_flow.update), Controller.toggleActiveFlow)
	.patch(
		VerifyPermissions(Permissions.chatbot_flow.update),
		UpdateFlowValidator,
		Controller.updateFlow
	);

router
	.route('/flows')
	.get(Controller.listFlows)
	.post(
		VerifyPermissions(Permissions.chatbot_flow.create),
		CreateFlowValidator,
		Controller.createFlow
	);

router
	.route('/:id/download-response')
	.all(VerifyPermissions(Permissions.chatbot.export), IDValidator)
	.get(Controller.downloadResponses);

router
	.route('/:id')
	.all(IDValidator)
	.delete(VerifyPermissions(Permissions.chatbot.delete), Controller.deleteBot)
	.put(VerifyPermissions(Permissions.chatbot.update), Controller.toggleActive)
	.patch(VerifyPermissions(Permissions.chatbot.update), CreateBotValidator, Controller.updateBot);

router
	.route('/')
	.get(Controller.listBots)
	.post(VerifyPermissions(Permissions.chatbot.create), CreateBotValidator, Controller.createBot);

export default router;
