import express from 'express';
import { VerifySession } from '../../middleware';
import Controller from './auth.controller';
import {
	LoginAccountValidator,
	RegisterAccountValidator,
	ResetPasswordValidator,
	UpdatePasswordValidator,
} from './auth.validator';

const router = express.Router();

router.route('/validate-auth').all(VerifySession).get(Controller.validateAuth);

router.route('/login').all(LoginAccountValidator).post(Controller.login);
router.route('/register').all(RegisterAccountValidator).post(Controller.register);
router.route('/reset-password').all(ResetPasswordValidator).post(Controller.resetPassword);
router.route('/update-password').all(UpdatePasswordValidator).post(Controller.updatePassword);
router.route('/logout').post(Controller.logout);

export default router;
