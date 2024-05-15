import PhonePeAPI from '../../config/PhonePeAPI';
import { PHONE_PE_ENDPOINTS, PHONE_PE_MERCHANT_ID } from '../../config/const';

type Props = {
	amount: number;
	reference_id: string;
	userID: string;
};

async function createOrder({ amount, reference_id, userID }: Props) {
	const amount_in_paise = amount * 100;

	const data = {
		merchantId: PHONE_PE_MERCHANT_ID,
		merchantTransactionId: reference_id,
		amount: amount_in_paise,
		merchantUserId: userID,
		redirectUrl: `https://keethjewels.com/phonepe/redirect/${reference_id}`,
		redirectMode: 'REDIRECT',
		callbackUrl: `https://keethjewels.com/phonepe/callback`,
		paymentInstrument: {
			type: 'PAY_PAGE',
		},
	};

	const { data: order } = await PhonePeAPI.getInstance().post(
		PHONE_PE_ENDPOINTS.PAY_API,
		{
			request: PhonePeAPI.getBase64(JSON.stringify(data)),
		},
		{
			headers: PhonePeAPI.getPayVerifyHeaders(JSON.stringify(data)),
		}
	);

	return {
		amount,
		reference_id: reference_id,
		status: order.code,
		transaction_url: order.data.instrumentResponse.redirectInfo.url,
	};
}

async function getOrderStatus(transaction_id: string) {
	const { data: order } = await PhonePeAPI.getInstance().get(
		`${PHONE_PE_ENDPOINTS.ORDER_STATUS_API}/${PHONE_PE_MERCHANT_ID}/${transaction_id}`,
		{
			headers: PhonePeAPI.getOrderStatusHeaders(transaction_id),
		}
	);

	return {
		amount: Number(order.data.amount) / 100,
		reference_id: order.data.merchantTransactionId,
		transaction_id: order.data.transactionId,
		status: order.code as
			| 'PAYMENT_SUCCESS'
			| 'BAD_REQUEST'
			| 'AUTHORIZATION_FAILED'
			| 'INTERNAL_SERVER_ERROR'
			| 'TRANSACTION_NOT_FOUND'
			| 'PAYMENT_ERROR'
			| 'PAYMENT_PENDING'
			| 'PAYMENT_DECLINED'
			| 'TIMED_OUT',
	};
}

function isOrderSuccess(status: string) {
	return status === 'PAYMENT_SUCCESS';
}

export default {
	createOrder,
	getOrderStatus,
	isOrderSuccess,
};
