import api from '@/lib/api';

export class DashboardService {
	static async getDashboardData() {
		try {
			const { data } = await api.get(`/overview/dashboard`);
			return {
				conversations: data.conversations.map((conversation: any) => {
					return {
						month: conversation.month ?? 0,
						year: conversation.year ?? 0,
						count: conversation.count ?? 0,
					};
				}),
				health: data.health ?? '',
				mediaSize: data.mediaSize ?? 0,
				messages:
					data.messages.map((message: any) => {
						return {
							month: message.month ?? 0,
							day: message.day ?? 0,
							count: message.count ?? 0,
						};
					}) ?? [],
				pendingToday: data.pendingToday ?? 0,
				phoneRecords: data.phoneRecords ?? 0,
				contacts: data.contacts ?? 0,
			};
		} catch (error) {
			return null;
		}
	}
}
