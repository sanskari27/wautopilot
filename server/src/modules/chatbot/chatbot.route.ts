import express from 'express';
import { Permissions } from '../../config/const';
import { IDValidator } from '../../middleware';
import VerifyPermissions from '../../middleware/VerifyPermissions';
import Controller from './chatbot.controller';
import {
	CreateFlowValidator,
	UpdateFlowValidator,
	UpdateWhatsappFlowValidator,
	WhatsappFlowValidator,
} from './chatbot.validator';

const router = express.Router();

router.route('/whatsapp-flows/:id/export').get(Controller.exportWhatsappFlow);

router
	.route('/whatsapp-flows/:id/publish')
	.post(VerifyPermissions(Permissions.whatsapp_flow.update), Controller.publishWhatsappFlow);

router
	.route('/whatsapp-flows/:id/assets')
	.get(Controller.getWhatsappFlowAssets)
	.post(
		VerifyPermissions(Permissions.whatsapp_flow.update),
		UpdateWhatsappFlowValidator,
		Controller.updateWhatsappFlowContents
	);

router
	.route('/whatsapp-flows/:id')
	.delete(VerifyPermissions(Permissions.whatsapp_flow.delete), Controller.deleteWhatsappFlow)
	.patch(
		VerifyPermissions(Permissions.whatsapp_flow.update),
		WhatsappFlowValidator,
		Controller.updateWhatsappFlow
	);

router
	.route('/whatsapp-flows')
	.get(Controller.listWhatsappFlows)
	.post(
		VerifyPermissions(Permissions.whatsapp_flow.create),
		WhatsappFlowValidator,
		Controller.createWhatsappFlow
	);

router
	.route('/flows/:id/download-response')
	.all(VerifyPermissions(Permissions.chatbot_flow.export), IDValidator)
	.get(Controller.downloadFlowResponses);

router
	.route('/flows/:id')
	.all(IDValidator)
	.get(Controller.chatBotFlowDetails)
	.delete(VerifyPermissions(Permissions.chatbot_flow.delete), Controller.deleteBot)
	.put(VerifyPermissions(Permissions.chatbot_flow.update), Controller.toggleActive)
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
	.delete(VerifyPermissions(Permissions.chatbot.delete), Controller.deleteBot);

export default router;
