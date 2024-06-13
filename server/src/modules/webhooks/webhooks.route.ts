import express from 'express';
import Controller from './webhooks.controller';

const router = express.Router();

router
	.route('/meta/whatsapp')
	.get(Controller.whatsappVerification)
	.post(Controller.whatsappCallback);

router.route('/razorpay/payment').post(Controller.razorpayPayment);

export default router;
