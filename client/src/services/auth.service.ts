import api from '@/lib/api';
import { signupSchema } from '@/schema/auth';
import { Permissions } from '@/types/permissions';
import { z } from 'zod';

export default class AuthService {
	static async isAuthenticated() {
		try {
			const { data } = await api.get('sessions/validate-auth', {
				headers: {
					'Cache-Control': 'no-cache',
					Pragma: 'no-cache',
					Expires: '0',
				},
				withCredentials: true,
			});
			return {
				authenticated: true,
				admin: data.isAdmin,
				agent: data.isAgent,
				master: data.isMaster,
			};
		} catch (err) {
			return {
				authenticated: false,
				admin: false,
				agent: false,
				master: false,
			};
		}
	}

	static async login(email: string, password: string) {
		try {
			await api.post(`/sessions/login`, {
				email,
				password,
			});
			return true;
		} catch (err) {
			console.log(err);

			return false;
		}
	}

	static async logout() {
		try {
			await api.post(`/sessions/logout`);
			return true;
		} catch (err) {
			return false;
		}
	}

	static async register(details: z.infer<typeof signupSchema>) {
		try {
			const data = await api.post(`/sessions/register`, {
				name: `${details.firstName} ${details.lastName}`.trim(),
				phone: details.phone,
				email: details.email,
				password: details.password,
			});
			return data;
		} catch (err) {
			//ignore
		}
	}

	static async forgotPassword(email: string, callbackURL: string) {
		try {
			await api.post(`/sessions/forgot-password`, {
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
			await api.post(`/sessions/reset-password/${code}`, {
				password,
			});
			return true;
		} catch (err) {
			return false;
		}
	}

	static async userDetails() {
		try {
			const { data } = await api.get(`/sessions/details`);
			return {
				name: data.account.name ?? '',
				email: data.account.email ?? '',
				phone: data.account.phone ?? '',
				isSubscribed: data.account.isSubscribed ?? false,
				subscription_expiry: data.account.subscription_expiry ?? '',
				walletBalance: data.account.walletBalance ?? 0,
				no_of_devices: data.account.no_of_devices ?? 0,
				permissions: data.account.permissions ?? {},
				isMaster: data.account.isMaster ?? false,
				isAdmin: data.account.isAdmin ?? false,
				isAgent: data.account.isAgent ?? false,
			} as {
				name: string;
				email: string;
				phone: string;
				isSubscribed: boolean;
				subscription_expiry: string;
				walletBalance: number;
				no_of_devices: number;
				permissions: Permissions;
				isMaster: boolean;
				isAdmin: boolean;
				isAgent: boolean;
			};
		} catch (err) {
			return null;
		}
	}

	static async addMoney(amount: number) {
		try {
			const { data } = await api.post(`/payment/add-money`, {
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
			await api.post(`/payment/confirm-transaction/${transaction_id}`);
			return true;
		} catch (err) {
			return false;
		}
	}

	static async serviceAccount(id: string) {
		try {
			await api.post(`/sessions/service-account/${id}`);
			return true;
		} catch (err) {
			return false;
		}
	}

	static async generateConversationMessageKey() {
		try {
			const {
				data: { key },
			} = await api.post(`/conversation-message-key`);
			return key as string;
		} catch (err) {
			return '';
		}
	}
}
