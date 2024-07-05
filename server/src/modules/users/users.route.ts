import express from 'express';
import { UserLevel } from '../../config/const';
import { IDValidator, VerifyMinLevel } from '../../middleware';
import Controller from './users.controller';
import { CreateAgentValidator, UpgradePlanValidator } from './users.validator';

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

router.route('/agents/:id').all(VerifyMinLevel(UserLevel.Admin)).post(Controller.removeAgent);

router
	.route('/agents')
	.all(VerifyMinLevel(UserLevel.Admin))
	.get(Controller.getAgents)
	.post(CreateAgentValidator, Controller.createAgent);

export default router;
