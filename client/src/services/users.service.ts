import api from '@/lib/api';

export default class UserService {
	static async listMessageTags() {
		const { data } = await api.get(`/users/message-tags`);
		return data.tags as string[];
	}

	static async createMessageTags(tags: string[]) {
		const { data } = await api.post(`/users/message-tags`, {
			tags,
		});
		return data.tags;
	}
}