import Logger from 'n23-logger';
import DateUtils from '../../../../utils/DateUtils';
import RazorpayAPI from '../../config/RazorpayAPI';

type Props = {
	reference_id: string;
	customer_id: string;
	frequency: 'yearly' | 'monthly';
	data?: { [key: string]: string };
};

async function createOrder({ customer_id, reference_id, frequency, data = {} }: Props) {
	const order = await RazorpayAPI.orders.create({
		amount: 100,
		currency: 'INR',
		method: 'upi',
		customer_id: customer_id,
		receipt: reference_id,
		notes: data,
		token: {
			frequency,
			max_amount: 9999900,
			expire_at: DateUtils.getMomentNow().add(20, 'years').unix(),
			// recurring_value: 25,
			// recurring_type: 'on',
		},
	});

	return {
		id: order.id,
		reference_id: order.receipt,
	};
}

type RegistrationLinkProps = {
	customer: {
		name: string;
		email: string;
		contact: string;
	};
	description: string;
	maxAmount: number;
	frequency: 'monthly' | 'yearly';
	reference_id: string;
	data?: { [key: string]: string };
};

async function createRegistrationLink({
	customer,
	frequency,
	maxAmount,
	description,
	reference_id,
	data,
}: RegistrationLinkProps) {
	const res = await RazorpayAPI.subscriptions.createRegistrationLink({
		customer: customer,
		type: 'link',
		amount: 100,
		currency: 'INR',
		description: description,
		subscription_registration: {
			method: 'upi',
			max_amount: maxAmount * 100,
			expire_at: DateUtils.getMomentNow().add(20, 'years').unix(),
			frequency: frequency,
		},
		receipt: reference_id,
		email_notify: 1,
		sms_notify: 1,
		expire_by: DateUtils.getMomentNow().add(20, 'years').unix(),
		notes: data,
	});
	if (!res.short_url) {
		return null;
	}

	Logger.debug(res);

	return {
		order_id: res.order_id as string,
		short_url: res.short_url as string,
	};
}

async function createSubsequentPayment({
	amount,
	customer_id,
	reference_id,
	token_id,
	data = {},
}: Omit<Props, 'frequency'> & {
	amount: number;
	token_id: string;
}) {
	const customer = await RazorpayAPI.customers.fetch(customer_id);

	const order = await RazorpayAPI.orders.create({
		amount: amount * 100,
		currency: 'INR',
		payment_capture: true,
		receipt: reference_id,
	});

	const recurring = await RazorpayAPI.payments.createRecurringPayment({
		email: customer.email ?? '',
		contact: customer.contact ?? '',
		amount: amount * 100,
		currency: 'INR',
		order_id: order.id,
		customer_id: customer_id,
		recurring: '1',
		token: token_id,
		notes: data,
	});

	return {
		order_id: recurring.razorpay_order_id,
		payment_id: recurring.razorpay_payment_id,
		signature: recurring.razorpay_signature,
	};
}

export default {
	createOrder,
	createRegistrationLink,
	createSubsequentPayment,
};
