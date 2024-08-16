import api from '@/lib/api';
import { Admin } from '@/types/admin';

export default class AdminsService {
	static async listAdmins() {
		const { data } = await api.get(`/users/admins`);
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
		}) as Admin[];
	}

	static async extendExpiry(id: string, date: string) {
		await api.post(`/users/admins/${id}/extend-subscription`, { date });
		return true;
	}

	static async upgradePlan(id: string, data: { plan_id: string; date: string }) {
		await api.post(`/users/admins/${id}/upgrade-plan`, { ...data });
	}
	static async setMarkUpPrice(id: string, rate: number) {
		await api.post(`/users/admins/${id}/markup-price`, {
			rate,
		});
	}
}
