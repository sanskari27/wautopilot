export const PHONE_PE_API_URL = process.env.PHONE_PE_API_URL as string;

export const PHONE_PE_SALT = process.env.PHONE_PE_SALT as string;
export const PHONE_PE_SALT_INDEX = process.env.PHONE_PE_SALT_INDEX as string;

export const PHONE_PE_MERCHANT_ID = process.env.PHONE_PE_MERCHANT_ID as string;

export const PHONE_PE_ENDPOINTS = {
	PAY_API: '/pg/v1/pay',
	REFUND_API: '/pg/v1/refund',
	ORDER_STATUS_API: '/pg/v1/status',
};
