import PhonePeAPI from '../../config/PhonePeAPI';
import { PHONE_PE_ENDPOINTS, PHONE_PE_MERCHANT_ID } from '../../config/const';

type Props = {
	amount: number;
	reference_id: string;
	order_id: string;
};

async function createRefund({ amount, reference_id,  order_id }: Props) {
	const amount_in_paise = amount * 100;

	const req_data = {
		merchantId: PHONE_PE_MERCHANT_ID,
		merchantTransactionId: reference_id,
		originalTransactionId: order_id,
		amount: amount_in_paise,
		callbackUrl: `https://keethjewels.com/phonepe/callback`,
	};

	const { data } = await PhonePeAPI.getInstance().post(
		PHONE_PE_ENDPOINTS.REFUND_API,
		{
			request: PhonePeAPI.getBase64(JSON.stringify(req_data)),
		},
		{
			headers: PhonePeAPI.getPayVerifyHeaders(JSON.stringify(req_data)),
		}
	);

	return {
		amount,
		reference_id: reference_id,
		status: data.code,
	};
}

async function getRefundStatus(transaction_id: string) {
	const { data } = await PhonePeAPI.getInstance().get(
		`${PHONE_PE_ENDPOINTS.ORDER_STATUS_API}/${PHONE_PE_MERCHANT_ID}/${transaction_id}`,
		{
			headers: PhonePeAPI.getOrderStatusHeaders(transaction_id),
		}
	);

	return {
		amount: Number(data.data.amount) / 100,
		reference_id: data.data.merchantTransactionId,
		transaction_id: data.data.transactionId,
		status: data.code as
			| 'INTERNAL_SERVER_ERROR'
			| 'BAD_REQUEST'
			| 'AUTHORIZATION_FAILED'
			| 'TRANSACTION_NOT_FOUND'
			| 'PAYMENT_ERROR'
			| 'PAYMENT_PENDING'
			| 'PAYMENT_DECLINED'
			| 'REVERSAL_WINDOW_EXCEEDED'
			| 'PAYMENT_SUCCESS',
	};
}

function isRefundSuccess(status: string) {
	return status === 'PAYMENT_SUCCESS';
}

export default {
	createRefund,
	getRefundStatus,
	isRefundSuccess,
};
