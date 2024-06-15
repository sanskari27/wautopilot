import DateUtils from '../../../../utils/DateUtils';
import RazorpayAPI from '../../config/RazorpayAPI';

type Props = {
	reference_id: string;
	customer_id: string;
	data?: { [key: string]: string };
};

async function createOrder({ customer_id, reference_id, data = {} }: Props) {
	const order = await RazorpayAPI.orders.create({
		amount: 0,
		currency: 'INR',
		method: 'emandate',
		payment_capture: true,
		customer_id: customer_id,
		receipt: reference_id,
		notes: data,
		token: {
			auth_type: 'debitcard',
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

async function createSubsequentPayment({
	amount,
	customer_id,
	reference_id,
	token_id,
	data = {},
}: Props & {
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
	createSubsequentPayment,
};
