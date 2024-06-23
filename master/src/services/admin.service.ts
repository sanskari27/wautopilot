/* eslint-disable @typescript-eslint/no-explicit-any */
import APIInstance from '../config/APIInstance';

export default class AdminsService {
	static async listAdmins() {
		try {
			const { data } = await APIInstance.get(`/users/admins`);
			return (data.users ?? []).map((admin: any) => {
				return {
					id: admin.id ?? '',
					email: admin.email ?? '',
					isSubscribed: admin.isSubscribed ?? false,
					phone: admin.phone ?? '',
					subscription_expiry: admin.subscription_expiry ?? '',
					name: admin.name ?? '',
					markup: admin.markup ?? 0,
				};
			});
		} catch (err) {
			return [];
		}
	}

	static async extendExpiry(id: string, date: string) {
		try {
			await APIInstance.post(`/users/admins/${id}/extend-subscription`, { date });
			return true;
		} catch (err) {
			return false;
		}
	}

	static async upgradePlan(id: string, data: { plan_id: string; date: string }) {
		try {
			await APIInstance.post(`/users/admins/${id}/upgrade-plan`, { ...data });
			return true;
		} catch (err) {
			return false;
		}
	}
	static async setMarkUpPrice(id: string, rate: number) {
		try {
			await APIInstance.post(`/users/admins/${id}/markup-price`, {
				rate,
			});
			return true;
		} catch (err) {
			return false;
		}
	}
}
