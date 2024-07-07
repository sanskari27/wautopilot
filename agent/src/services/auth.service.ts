import axios from 'axios';
import APIInstance from '../config/APIInstance';
import { SERVER_URL } from '../config/const';
import { UserDetails, UserLevel } from '../store/types/UserState';

export default class AuthService {
	static async isAuthenticated() {
		try {
			await axios.get(SERVER_URL + 'sessions/validate-auth/agent', {
				headers: {
					'Cache-Control': 'no-cache',
					Pragma: 'no-cache',
					Expires: '0',
				},
				withCredentials: true,
			});
			return true;
		} catch (err) {
			return false;
		}
	}

	static async login(
		email: string,
		password: string,
		accessLevel: UserLevel,
		latitude: number,
		longitude: number
	) {
		try {
			await APIInstance.post(`/sessions/login`, {
				email,
				password,
				accessLevel,
				latitude,
				longitude,
			});
			return true;
		} catch (err) {
			return false;
		}
	}

	static async logout() {
		try {
			await APIInstance.post(`/sessions/logout`);
			return true;
		} catch (err) {
			return false;
		}
	}

	static async registerUser(name: string, phone: string, email: string, accessLevel: UserLevel) {
		try {
			const data = await APIInstance.post(`/sessions/register`, {
				name,
				phone,
				email,
				accessLevel,
			});
			return data;
		} catch (err) {
			//ignore
		}
	}

	static async forgotPassword(email: string, callbackURL: string) {
		try {
			await APIInstance.post(`/sessions/forgot-password`, {
				email,
				callbackURL,
			});
			return true;
		} catch (err) {
			return false;
		}
	}

	static async resetPassword(password: string, code: string) {
		try {
			await APIInstance.post(`/sessions/reset-password/${code}`, {
				password,
			});
			return true;
		} catch (err) {
			return false;
		}
	}

	static async userDetails() {
		try {
			const { data } = await APIInstance.get(`/sessions/details`);
			return {
				name: data.account.name ?? '',
				email: data.account.email ?? '',
				phone: data.account.phone ?? '',
				isSubscribed: data.account.isSubscribed ?? false,
				subscription_expiry: data.account.subscription_expiry ?? '',
				walletBalance: data.account.walletBalance ?? 0,
				no_of_devices: data.account.no_of_devices ?? 0,
				permissions: data.account.permissions ?? {},
			} as UserDetails;
		} catch (err) {
			return null;
		}
	}

	static async addMoney(amount: number) {
		try {
			const { data } = await APIInstance.post(`/payment/add-money`, {
				amount,
			});
			return {
				transaction_id: data.transaction_id ?? '',
				razorpay_options: {
					description: data.razorpay_options.description ?? '',
					currency: data.razorpay_options.currency ?? '',
					amount: data.razorpay_options.amount ?? 0,
					name: data.razorpay_options.name ?? '',
					order_id: data.razorpay_options.order_id ?? '',
					prefill: {
						name: data.razorpay_options.prefill.name ?? '',
						email: data.razorpay_options.prefill.email ?? '',
						contact: data.razorpay_options.prefill.contact ?? '',
					},
					key: data.razorpay_options.key ?? '',
					theme: {
						color: data.razorpay_options.theme.color ?? '',
					},
				},
			} as {
				transaction_id: string;
				razorpay_options: {
					description: string;
					currency: string;
					amount: number;
					name: string;
					order_id: string;
					prefill: {
						name: string;
						email: string;
						contact: string;
					};
					key: string;
					theme: {
						color: string;
					};
				};
			};
		} catch (err) {
			return null;
		}
	}
	static async confirmPayment(transaction_id: string) {
		try {
			await APIInstance.post(`/payment/confirm-transaction/${transaction_id}`);
			return true;
		} catch (err) {
			return false;
		}
	}

	static async generateConversationMessageKey() {
		try {
			const {
				data: { key },
			} = await APIInstance.post(`/conversation-message-key`);
			return key as string;
		} catch (err) {
			return '';
		}
	}

	static async serviceAccount(id: string) {
		try {
			await APIInstance.post(`/sessions/service-account/${id}`);
			return true;
		} catch (err) {
			return false;
		}
	}
}
