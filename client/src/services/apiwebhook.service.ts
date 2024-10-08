import api from '@/lib/api';

export default class APIWebhookService {
	static async listKeys() {
		const { data } = await api.get('/api-keys');
		return (data.list ?? []).map((list: any) => {
			return {
				id: list.id ?? '',
				name: list.name ?? '',
				device: list.device ?? '',
				createdAt: list.createdAt ?? '',
			};
		}) as {
			id: string;
			name: string;
			device: string;
			createdAt: string;
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
		await api.post('/api-keys/webhooks', {
			name,
			device,
			url,
		});
	}

	static async listWebhook() {
		const { data } = await api.get('/api-keys/webhooks');
		return (data.list ?? []).map((list: any) => {
			return {
				id: list.id ?? '',
				name: list.name ?? '',
				device: list.device ?? '',
				created_at: list.createdAt ?? '',
				url: list.url ?? '',
			};
		}) as {
			id: string;
			name: string;
			device: string;
			url: string;
			created_at: string;
		}[];
	}

	static async deleteApiKey(id: string) {
		await api.delete(`/api-keys/${id}`);
	}

	static async deleteWebhook(id: string) {
		await api.delete(`/api-keys/webhooks/${id}`);
	}

	static async validateWebhook(id: string) {
		await api.post(`/api-keys/webhooks/${id}/validate`);
	}
}
