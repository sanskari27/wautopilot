import express from 'express';
import { UserLevel } from '../../config/const';
import { VerifyMinLevel } from '../../middleware';
import Controller from './users.controller';

const router = express.Router();

router.route('/admins').all(VerifyMinLevel(UserLevel.Master)).get(Controller.getAdmins);

export default router;
