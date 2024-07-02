import express from 'express';
import Controller from './overview.controller';

const router = express.Router();

router.route('/dashboard').get(Controller.dashboardDetails);

export default router;
