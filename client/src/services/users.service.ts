import api from '@/lib/api';

export default class UserService {
	static async listMessageTags() {
		try {
			const { data } = await api.get(`/users/message-tags`);
			return data.tags as string[];
		} catch (e) {
			return [];
		}
	}

	static async createMessageTags(tags: string[]) {
		const { data } = await api.post(`/users/message-tags`, {
			tags,
		});
		return data.tags;
	}
}
