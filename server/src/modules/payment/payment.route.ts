import express from 'express';
import { IDValidator } from '../../middleware';
import Controller from './payment.controller';
import { AddAmountValidator } from './payment.validator';

const router = express.Router();

router.route('/start-subscription').post(Controller.startSubscription);
router.route('/verify-subscription-token').post(Controller.verifyToken);

router.route('/add-money').all(AddAmountValidator).post(Controller.addMoney);

router.route('/confirm-transaction/:id').all(IDValidator).post(Controller.confirmWalletTransaction);

export default router;
