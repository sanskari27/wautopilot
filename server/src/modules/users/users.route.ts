import express from 'express';
import { UserLevel } from '../../config/const';
import { IDValidator, VerifyMinLevel } from '../../middleware';
import Controller from './users.controller';
import {
	CreateAgentValidator,
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
	.post(PermissionsValidator, Controller.updateAgent);

router
	.route('/agents/:id')
	.all(VerifyMinLevel(UserLevel.Admin), IDValidator)
	.post(CreateAgentValidator, Controller.updateAgent)
	.delete(Controller.removeAgent);

router
	.route('/agents')
	.all(VerifyMinLevel(UserLevel.Agent))
	.get(Controller.getAgents)
	.all(VerifyMinLevel(UserLevel.Admin))
	.post(CreateAgentValidator, Controller.createAgent);

export default router;
