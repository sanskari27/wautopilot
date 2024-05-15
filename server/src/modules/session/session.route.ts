import express from 'express';
import { UserLevel } from '../../config/const';
import { VerifyMinLevel, VerifySession } from '../../middleware';
import Controller from './session.controller';
import {
	LoginAccountValidator,
	ResetPasswordValidator,
	UpdatePasswordValidator,
} from './session.validator';

const router = express.Router();

router
	.route('/validate-auth/admin')
	.all(VerifySession, VerifyMinLevel(UserLevel.Admin))
	.get(Controller.validateAuth);
router
	.route('/validate-auth')
	.all(VerifySession, VerifyMinLevel(UserLevel.User))
	.get(Controller.validateAuth);

router.route('/login').all(LoginAccountValidator).post(Controller.login);
router.route('/reset-password').all(ResetPasswordValidator).post(Controller.resetPassword);
router.route('/update-password').all(UpdatePasswordValidator).post(Controller.updatePassword);
router.route('/logout').post(Controller.logout);
router.route('/register').all(LoginAccountValidator).post(Controller.register);

export default router;
