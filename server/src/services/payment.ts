import { Types } from 'mongoose';
import Logger from 'n23-logger';
import { CartDB, CouponDB, PaymentDB, PlanDB, SubscriptionDB } from '../../mongo';
import IPayment from '../../mongo/types/payment';
import IPlan from '../../mongo/types/plan';
import {
	RAZORPAY_API_KEY,
	SUBSCRIPTION_STATUS,
	TAX_RATE,
	TRANSACTION_STATUS,
} from '../config/const';
import { CustomError } from '../errors';
import COMMON_ERRORS from '../errors/common-errors';
import RazorpayProvider from '../provider/razorpay';

export default class PaymentService {
	private user_id: Types.ObjectId;

	constructor(user_id: Types.ObjectId) {
		this.user_id = user_id;
	}

	async addToCart(details: {
		plan_id: Types.ObjectId;
		type: 'SUBSCRIPTION' | 'ONE_TIME';
		quantity: number;
		name: string;
		phone_number: string;
		email: string;
		billing_address: Partial<{
			street: string;
			city: string;
			district: string;
			state: string;
			country: string;
			pincode: string;
			gstin: string;
		}>;
	}) {
		const plan = await PlanDB.findById(details.plan_id);
		if (!plan) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		const gross_amount = plan.plan_price * details.quantity;
		const tax_amount = gross_amount * TAX_RATE;
		const total_amount = gross_amount + tax_amount;

		const cart = await CartDB.create({
			...details,
			linked_to: this.user_id,
			gross_amount,
			tax: tax_amount,
			total_amount,
		});

		return {
			cart_id: cart._id,
			gross_amount,
			tax_amount,
			total_amount,
			plan: {
				plan_name: plan.plan_name,
				plan_description: plan.plan_description,
				plan_price: plan.plan_price,
				plan_duration: plan.plan_duration,
				features: plan.features,
				no_of_agents: plan.no_of_agents,
				no_of_devices: plan.no_of_devices,
			},
			discount: 0,
			discount_coupon: cart.discount_coupon,
		};
	}

	async getCart(cart_id: Types.ObjectId) {
		const cart = await CartDB.findById(cart_id);
		if (!cart) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		const plan = await PlanDB.findById(cart.plan_id);
		if (!plan) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		return {
			cart_id: cart._id,
			gross_amount: cart.gross_amount,
			tax_amount: cart.tax,
			total_amount: cart.total_amount,
			plan: {
				plan_name: plan.plan_name,
				plan_description: plan.plan_description,
				plan_price: plan.plan_price,
				plan_duration: plan.plan_duration,
				features: plan.features,
				no_of_agents: plan.no_of_agents,
				no_of_devices: plan.no_of_devices,
			},
			discount: cart.discount,
			discount_coupon: cart.discount_coupon,
		};
	}

	async applyCoupon(cart_id: Types.ObjectId, coupon: string) {
		const cart = await CartDB.findById(cart_id).populate<{
			plan_id: IPlan;
		}>('plan_id');
		if (!cart) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		const coupon_doc = await CouponDB.findOne({ code: coupon });
		if (!coupon_doc) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		} else if (coupon_doc.available_coupons <= 0) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		const gross_amount = cart.gross_amount;
		const tax_amount = gross_amount * TAX_RATE;
		const discount =
			coupon_doc.discount_type === 'percentage'
				? (gross_amount * coupon_doc.discount_percentage) / 100
				: coupon_doc.discount_amount;
		const total_amount = gross_amount + tax_amount - discount;

		coupon_doc.available_coupons -= 1;

		await coupon_doc.save();
		await cart.updateOne(
			{
				_id: cart_id,
			},
			{
				$set: {
					discount_coupon: coupon,
					discount,
					total_amount,
				},
			}
		);

		return {
			cart_id: cart._id,
			gross_amount,
			tax_amount,
			total_amount,
			plan: {
				plan_name: cart.plan_id.plan_name,
				plan_description: cart.plan_id.plan_description,
				plan_price: cart.plan_id.plan_price,
				plan_duration: cart.plan_id.plan_duration,
				features: cart.plan_id.features,
				no_of_agents: cart.plan_id.no_of_agents,
				no_of_devices: cart.plan_id.no_of_devices,
			},
			discount,
			discount_coupon: coupon,
		};
	}

	async removeCoupon(cart_id: Types.ObjectId) {
		const cart = await CartDB.findById(cart_id).populate<{
			plan_id: IPlan;
		}>('plan_id');

		if (!cart) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		if (cart.discount_coupon) {
			const coupon_doc = await CouponDB.findOne({ code: cart.discount_coupon });
			if (coupon_doc) {
				coupon_doc.available_coupons += 1;
				await coupon_doc.save();
			}
			cart.discount_coupon = '';
			cart.discount = 0;
			cart.total_amount = cart.gross_amount + cart.tax;
			await cart.save();
		}

		return {
			cart_id: cart._id,
			gross_amount: cart.gross_amount,
			tax_amount: cart.tax,
			total_amount: cart.total_amount,
			plan: {
				plan_name: cart.plan_id.plan_name,
				plan_description: cart.plan_id.plan_description,
				plan_price: cart.plan_id.plan_price,
				plan_duration: cart.plan_id.plan_duration,
				features: cart.plan_id.features,
				no_of_agents: cart.plan_id.no_of_agents,
				no_of_devices: cart.plan_id.no_of_devices,
			},
			discount: 0,
			discount_coupon: '',
		};
	}

	async checkout(cart_id: Types.ObjectId) {
		const cart = await CartDB.findById(cart_id).populate<{
			plan_id: IPlan;
		}>('plan_id');
		if (!cart) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		if (cart.transaction_status !== TRANSACTION_STATUS.PENDING) {
			throw new CustomError(COMMON_ERRORS.PERMISSION_DENIED);
		}

		let customer = await RazorpayProvider.customers.fetchCustomerByContact(cart.phone_number);
		if (!customer) {
			customer = await RazorpayProvider.customers.createCustomer({
				name: cart.name,
				email: cart.email,
				phone_number: cart.phone_number,
				billing_address: cart.billing_address,
			});
		}

		if (!customer) {
			throw new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR);
		}

		if (cart.type === 'SUBSCRIPTION') {
			const subscription = await SubscriptionDB.create({
				linked_to: this.user_id,
				plan_id: cart.plan_id._id,
				billing_details: {
					name: cart.name,
					phone_number: cart.phone_number,
					email: cart.email,
					billing_address: cart.billing_address,
				},
				subscription_status: SUBSCRIPTION_STATUS.INACTIVE,
				gross_amount: cart.gross_amount,
				discount: cart.discount,
				total_amount: cart.total_amount,
				tax: cart.tax,
			});

			const order = await RazorpayProvider.emandate.createRegistrationLink({
				customer: {
					name: subscription.billing_details.name,
					email: subscription.billing_details.email,
					contact: subscription.billing_details.phone_number,
				},
				description: `Subscription for ${cart.plan_id.plan_name}`,
				maxAmount: cart.total_amount * 10,
				frequency: cart.plan_id.plan_duration === 28 ? 'monthly' : 'yearly',
				reference_id: subscription._id.toString(),
			});

			if (!order) {
				subscription.remove();
				throw new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR);
			}

			subscription.order_id = order.order_id;
			await subscription.save();

			return {
				transaction_id: subscription._id.toString(),
				order_id: order.order_id,
				subscription_link: order.short_url,
			};
		} else {
			const payment = await PaymentDB.create({
				linked_to: this.user_id,
				plan_id: cart.plan_id._id,
				quantity: cart.quantity,
				billing_details: {
					name: cart.name,
					phone_number: cart.phone_number,
					email: cart.email,
					billing_address: cart.billing_address,
				},
				transaction_status: TRANSACTION_STATUS.PENDING,
				gross_amount: cart.gross_amount,
				discount: cart.discount,
				total_amount: cart.total_amount,
				tax: cart.tax,
			});
			const order = await RazorpayProvider.orders.createOrder({
				amount: cart.total_amount,
				reference_id: payment._id.toString(),
				customer_id: customer.id,
				data: {
					cart_id: cart_id.toString(),
				},
			});

			if (!order) {
				payment.remove();
				throw new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR);
			}

			payment.order_id = order.id;
			await payment.save();

			return {
				transaction_id: payment._id.toString(),
				order_id: order.id,
				razorpay_options: {
					description: `Wautopilot • ${cart.plan_id.plan_name}`,
					currency: order.currency,
					amount: order.amount,
					name: 'Wautopilot',
					order_id: order.id,
					prefill: {
						name: cart.name,
						contact: cart.phone_number,
						email: cart.email,
					},
					key: RAZORPAY_API_KEY,
					theme: {
						color: '#4CB072',
					},
				},
			};
		}
	}

	async confirmPayment(transaction_id: Types.ObjectId, payment_id: string) {
		const payment = await PaymentDB.findById(transaction_id);

		if (!payment) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		PaymentService.verifyPayment(payment, payment_id);
	}

	private static async verifyPayment(payment: IPayment, payment_id: string) {
		if (payment.transaction_status === TRANSACTION_STATUS.SUCCESS) {
			throw new CustomError(COMMON_ERRORS.PERMISSION_DENIED);
		}

		const order = await RazorpayProvider.orders.getOrderStatus(payment.order_id);
		const r_payment = await RazorpayProvider.payments.getPayment(payment_id);

		if (order === 'paid' && r_payment.status === 'captured') {
			payment.transaction_status = TRANSACTION_STATUS.SUCCESS;
			payment.payment_id = payment_id;
		} else if (r_payment.status === 'failed') {
			payment.transaction_status = TRANSACTION_STATUS.FAILED;
		} else {
			return;
		}

		await payment.save();
		Logger.info('Payment confirmed', `Payment ID: ${payment_id} | Transaction ID: ${payment._id}`);
	}

	static async confirmPaymentByOrderId(order_id: string, payment_id: string) {
		const payment = await PaymentDB.findOne({
			order_id,
		});
		if (!payment) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		PaymentService.verifyPayment(payment, payment_id);
	}

	static async confirmTokenPayment(order_id: string, token: string) {
		const order = await SubscriptionDB.findOne({
			order_id,
		});
		if (!order) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		if (order.subscription_status === SUBSCRIPTION_STATUS.ACTIVE) {
			throw new CustomError(COMMON_ERRORS.PERMISSION_DENIED);
		}

		order.subscription_status = SUBSCRIPTION_STATUS.ACTIVE;
		order.token_id = token;

		await order.save();

		let customer = await RazorpayProvider.customers.fetchCustomerByContact(
			order.billing_details.phone_number
		);
		if (!customer) {
			customer = await RazorpayProvider.customers.createCustomer(order.billing_details);
		}

		if (!customer) {
			throw new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR);
		}

		const subsequentPayment = await RazorpayProvider.emandate.createSubsequentPayment({
			amount: order.total_amount,
			customer_id: customer.id,
			reference_id: order._id.toString(),
			token_id: token,
		});

		if (!subsequentPayment) {
			throw new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR);
		}

		Logger.info(
			'Subscription confirmed',
			`Order ID: ${order_id} | Subscription ID: ${order._id} | Token ID: ${token}`
		);

		await PaymentDB.create({
			linked_to: order.linked_to,
			plan_id: order.plan_id,
			quantity: 1,
			billing_details: order.billing_details,
			transaction_status: TRANSACTION_STATUS.SUCCESS,
			gross_amount: order.gross_amount,
			discount: order.discount,
			total_amount: order.total_amount,
			tax: order.tax,
			order_id: subsequentPayment.order_id,
			payment_id: subsequentPayment.payment_id,
		});
	}
}
