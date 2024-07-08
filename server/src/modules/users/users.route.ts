import express from 'express';
import { UserLevel } from '../../config/const';
import { IDValidator, VerifyMinLevel } from '../../middleware';
import Controller from './users.controller';
import {
	AssignTaskValidator,
	CreateAgentValidator,
	CreateQuickReplyValidator,
	PasswordValidator,
	PermissionsValidator,
	UpgradePlanValidator,
} from './users.validator';

const router = express.Router();

router
	.route('/admins/:id/markup-price')
	.all(VerifyMinLevel(UserLevel.Master), IDValidator)
	.post(Controller.setMarkupPrice);

router
	.route('/admins/:id/upgrade-plan')
	.all(VerifyMinLevel(UserLevel.Master), IDValidator, UpgradePlanValidator)
	.post(Controller.upgradePlan);

router
	.route('/admins/:id/extend-subscription')
	.all(VerifyMinLevel(UserLevel.Master), IDValidator)
	.post(Controller.extendSubscription);

router.route('/admins').all(VerifyMinLevel(UserLevel.Master)).get(Controller.getAdmins);

router
	.route('/agents/:id/permissions')
	.all(VerifyMinLevel(UserLevel.Admin), IDValidator)
	.post(PermissionsValidator, Controller.assignPermissions);

router
	.route('/agents/:id/logs')
	.all(VerifyMinLevel(UserLevel.Admin), IDValidator)
	.get(Controller.agentLogs);

router.route('/agents/:id/tasks').all(IDValidator).get(Controller.getAssignedTask);

router
	.route('/agents/:id')
	.all(VerifyMinLevel(UserLevel.Admin), IDValidator)
	.post(CreateAgentValidator, Controller.updateAgent)
	.patch(PasswordValidator, Controller.updateAgentPassword)
	.delete(Controller.removeAgent);

router
	.route('/agents')
	.all(VerifyMinLevel(UserLevel.Agent))
	.get(Controller.getAgents)
	.all(VerifyMinLevel(UserLevel.Admin))
	.post(CreateAgentValidator, Controller.createAgent);

router
	.route('/quick-replies/:id')
	.all(IDValidator)
	.delete(Controller.deleteQuickReply)
	.put(CreateQuickReplyValidator, Controller.editQuickReply);

router
	.route('/quick-replies')
	.get(Controller.quickReplies)
	.post(CreateQuickReplyValidator, Controller.saveQuickReply);

router.route('/tasks/:id').all(IDValidator).patch(Controller.hideAssignedTask);

router
	.route('/tasks')
	.get(Controller.getAssignedTask)
	.post(AssignTaskValidator, Controller.assignTask);

export default router;
