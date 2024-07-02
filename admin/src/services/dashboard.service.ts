/* eslint-disable @typescript-eslint/no-explicit-any */
import APIInstance from '../config/APIInstance';

export class DashboardService {
	static async getDashboardData(device_id: string) {
		try {
			const { data } = await APIInstance.get(`${device_id}/overview/dashboard`);
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
							year: message.year ?? 0,
							count: message.count ?? 0,
						};
					}) ?? [],
				pendingToday: data.pendingToday ?? 0,
				phoneRecords: data.phoneRecords ?? 0,
			};
		} catch (error) {
			return null;
		}
	}
}
