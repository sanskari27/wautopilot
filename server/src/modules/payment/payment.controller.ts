import { NextFunction, Request, Response } from 'express';
import WalletTransactionDB from '../../../mongo/repo/WalletTransaction';
import { RAZORPAY_API_KEY } from '../../config/const';
import { CustomError, PAYMENT_ERRORS } from '../../errors';
import COMMON_ERRORS from '../../errors/common-errors';
import RazorpayProvider from '../../provider/razorpay';
import { UserService } from '../../services';
import { Respond, generateRandomID } from '../../utils/ExpressUtils';

async function startSubscription(req: Request, res: Response, next: NextFunction) {
	const { serviceAccount: account } = req.locals;
	try {
		const contact = await RazorpayProvider.customers.createCustomer({
			name: account.name,
			phone_number: account.phone,
			email: account.email,
		});

		if (!contact) {
			return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR));
		}

		const reference_id = generateRandomID();

		const order = await RazorpayProvider.emandate.createOrder({
			customer_id: contact.id,
			reference_id,
		});

		return Respond({
			res,
			status: 200,
			data: {
				// transaction_id,
				razorpay_options: {
					description: 'Wautopilot Emandate Payment',
					name: 'Wautopilot',
					order_id: order.id,
					customer_id: contact.id,
					recurring: '1',
					prefill: {
						name: account.name,
						contact: account.phone,
						email: account.email,
					},
					key: RAZORPAY_API_KEY,
					theme: {
						color: '#4CB072',
					},
				},
			},
		});
	} catch (err) {
		console.log(err);

		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function verifyToken(req: Request, res: Response, next: NextFunction) {
	const { serviceAccount: account } = req.locals;
	try {
		const contact = await RazorpayProvider.customers.createCustomer({
			name: account.name,
			phone_number: account.phone,
			email: account.email,
		});

		if (!contact) {
			return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR));
		}

		const token = await RazorpayProvider.customers.fetchToken(contact.id);

		if (!token) {
			return next(new CustomError(PAYMENT_ERRORS.NOT_PAID));
		}

		const recurring = await RazorpayProvider.emandate.createSubsequentPayment({
			amount: 50,
			customer_id: contact.id,
			reference_id: token.id,
			token_id: token.id,
		});
		console.log(recurring);

		return Respond({
			res,
			status: 200,
			data: {},
		});
	} catch (err) {
		console.log(err);

		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function addMoney(req: Request, res: Response, next: NextFunction) {
	const { serviceAccount: account } = req.locals;
	try {
		const contact = await RazorpayProvider.customers.createCustomer({
			name: account.name,
			phone_number: account.phone,
			email: account.email,
		});

		if (!contact) {
			return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR));
		}

		const reference_id = generateRandomID();

		const order = await RazorpayProvider.orders.createOrder({
			amount: req.locals.data as number,
			customer_id: contact.id,
			reference_id,
		});

		const { _id: transaction_id } = await WalletTransactionDB.create({
			amount: req.locals.data,
			reference_id,
			account_id: account.id,
			order_id: order.id,
			linked_to: account._id,
		});

		return Respond({
			res,
			status: 200,
			data: {
				transaction_id,
				razorpay_options: {
					description: 'Wautopilot One Time Payment',
					currency: order.currency,
					amount: order.amount * 100,
					name: 'Wautopilot',
					order_id: order.id,
					prefill: {
						name: account.name,
						contact: account.phone,
						email: account.email,
					},
					key: RAZORPAY_API_KEY,
					theme: {
						color: '#4CB072',
					},
				},
			},
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function confirmWalletTransaction(req: Request, res: Response, next: NextFunction) {
	const { id } = req.locals;
	try {
		const transaction = await WalletTransactionDB.findById(id);
		if (!transaction) {
			return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
		}

		const { order_id, amount, linked_to } = transaction;

		const order = await RazorpayProvider.orders.getOrder(order_id);

		if (order.status !== 'paid') {
			return next(new CustomError(PAYMENT_ERRORS.NOT_PAID));
		}

		const userService = await UserService.findById(linked_to);
		await userService.addWalletBalance(amount);

		return Respond({
			res,
			status: 200,
			data: {
				message: 'Transaction successful',
				wallet_balance: userService.walletBalance,
			},
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

const Controller = {
	addMoney,
	confirmWalletTransaction,
	startSubscription,
	verifyToken,
};

export default Controller;
