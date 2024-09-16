import api from '@/lib/api';
import { QuickReply } from '@/types/recipient';

export default class QuickReplyService {
	static async QuickReplies(): Promise<QuickReply[]> {
		try {
			const { data } = await api.get(`/users/quick-replies`);
			return (data.quickReplies ?? []).map((quickReply: any) => {
				return {
					id: quickReply.id ?? '',
					text: quickReply.text ?? '',
					type: quickReply.type ?? '',
					created_at: quickReply.created_at ?? '',
					updated_at: quickReply.updated_at ?? '',
				};
			});
		} catch (err) {
			return [];
		}
	}
}
