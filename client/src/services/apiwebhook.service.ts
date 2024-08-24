import api from '@/lib/api';

export default class APIWebhookService {
	static async listKeys() {
		const { data } = await api.get('/api-keys');
		return (data.list ?? []).map((list: any) => {
			return {
				id: list.id ?? '',
				name: list.name ?? '',
				device: list.device ?? '',
				created_at: list.created_at ?? '',
			};
		}) as {
			id: string;
			name: string;
			device: string;
		}[];
	}

	static async createApiKey(name: string, device: string) {
		const { data } = await api.post('/api-keys', {
			name,
			device,
		});

		return data.token as string;
	}

	static async RegenerateAPIKey(id: string) {
		const { data } = await api.post(`/api-keys/${id}/regenerate-token`);
		return data.token as string;
	}

	static async createWebhook(name: string, device: string, url: string) {
		await api.post('/webhooks', {
			name,
			device,
			url,
		});
	}

	static async listWebhook() {
		const { data } = await api.get('/webhooks');
		return (data.list ?? []).map((list: any) => {
			return {
				id: list.id ?? '',
				name: list.name ?? '',
				device: list.device ?? '',
				created_at: list.created_at ?? '',
				url: list.url ?? '',
			};
		}) as {
			id: string;
			name: string;
			device: string;
		}[];
	}

	static async deleteApiKey(id: string) {
		await api.delete(`/api-keys/${id}`);
	}
}
