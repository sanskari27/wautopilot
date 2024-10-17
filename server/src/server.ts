import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import configServer from './server-config';

import Logger from 'n23-logger';
import connectDB from '../mongo';
import { DATABASE_URL, PORT } from './config/const';
import PaymentService from './services/payment';
import SocketServer from './socket';
import { idValidator } from './utils/ExpressUtils';

//  ------------------------- Setup Variables
const app = express();

configServer(app);
connectDB(DATABASE_URL)
	.then(async () => {
		testPayments();
		Logger.info('Running Status', 'Database connected');
	})
	.catch((err) => {
		Logger.critical('Database Connection Failed', err);
		process.exit();
	});

const server = app.listen(PORT, async () => {
	SocketServer.getInstance(server);
	Logger.info('Running Status', `Server started on port ${PORT}`);
});

process.setMaxListeners(0);
process.on('unhandledRejection', (err: Error) => {
	Logger.critical('Unhandled rejection', err);
	server.close(() => process.exit(1));
});

async function testPayments() {
	// let data = await RazorpayAPI.orders.fetchPayments('order_PAB0ikQ7F7bF06');
	// let data = await RazorpayAPI.payments.fetch('pay_PAB1aBETFSLBCa');
	// Logger.debug(data, {
	// 	label: 'Payment Details',
	// });
	const paymentService = new PaymentService(idValidator('667403745ce8d579fa8e84ab')[1]!);
	let cart = await paymentService.addToCart({
		plan_id: idValidator('666aea41531f14911cb79888')[1]!,
		type: 'SUBSCRIPTION',
		quantity: 1,
		name: 'John Doe',
		phone_number: '917546027568',
		email: 'sanskarkumar85111@gmail.com',
		billing_address: {
			street: 'Street',
			city: 'City',
			district: 'District',
			state: 'State',
			country: 'Country',
			pincode: 'Pincode',
		},
	});
	// let cart = await paymentService.getCart(idValidator('670fee6e69307fe3c2af35e7')[1]!);
	Logger.debug(cart, {
		label: 'Cart Details Initial',
	});
	// cart = await paymentService.applyCoupon(cart.cart_id, 'WELCOME30');
	// Logger.debug(cart, {
	// 	label: 'Cart Details After Coupon',
	// });
	try {
		const order = await paymentService.checkout(cart.cart_id);
		if (!order) {
			Logger.error('Order not found', new Error('Order not found'));
			return;
		}
		Logger.debug(order!, {
			label: 'Order Details',
		});
	} catch (err) {
		Logger.debug(err!);
	}
}
