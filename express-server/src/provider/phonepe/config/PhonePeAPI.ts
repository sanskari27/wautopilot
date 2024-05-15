import axios, { AxiosInstance } from 'axios';
import crypto from 'crypto';
import {
	PHONE_PE_API_URL,
	PHONE_PE_ENDPOINTS,
	PHONE_PE_MERCHANT_ID,
	PHONE_PE_SALT,
	PHONE_PE_SALT_INDEX,
} from './const';

export default class PhonePeAPI {
	private static kycInstance: AxiosInstance;

	private constructor() {
		//`singleton
	}

	public static getInstance() {
		if (this.kycInstance === undefined) {
			this.kycInstance = axios.create({
				baseURL: PHONE_PE_API_URL,
				headers: {
					'Content-Type': 'application/json',
				},
			});
		}

		return this.kycInstance;
	}

	public static getBase64(data: string) {
		const base64Data = Buffer.from(data).toString('base64');
		return base64Data;
	}
	public static getPayVerifyHeaders(data: string) {
		const base64Data = this.getBase64(data);
		const endpoint = PHONE_PE_ENDPOINTS.PAY_API;
		const salt = PHONE_PE_SALT;

		const sha256 = crypto
			.createHash('sha256')
			.update(base64Data + endpoint + salt)
			.digest('hex');

		const tail = '###' + PHONE_PE_SALT_INDEX;

		const x_verify = sha256 + tail;

		return {
			'X-VERIFY': x_verify,
			'Content-Type': 'application/json',
		};
	}

	public static getOrderStatusHeaders(transaction_id: string) {
		const endpoint = PHONE_PE_ENDPOINTS.ORDER_STATUS_API;
		const salt = PHONE_PE_SALT;

		const sha256 = crypto
			.createHash('sha256')
			.update(`${endpoint}/${PHONE_PE_MERCHANT_ID}/${transaction_id}${salt}`)
			.digest('hex');

		const tail = '###' + PHONE_PE_SALT_INDEX;

		const x_verify = sha256 + tail;

		return {
			'X-VERIFY': x_verify,
			'X-MERCHANT-ID': PHONE_PE_MERCHANT_ID,
			'Content-Type': 'application/json',
		};
	}

	public static verifyHeader(x_verify: string, encodedData: string) {
		const salt = PHONE_PE_SALT;

		const sha256 = crypto.createHash('sha256').update(`${encodedData}${salt}`).digest('hex');

		const tail = '###' + PHONE_PE_SALT_INDEX;

		const generated_x_verify = sha256 + tail;

		return x_verify === generated_x_verify;
	}
}
