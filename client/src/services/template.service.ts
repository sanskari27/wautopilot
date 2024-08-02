import api from '@/lib/api';

export default class TemplateService {
	static async listTemplates() {
		try {
			const { data } = await api.get(`/template`);

			const templates = data.templates as {
				id: string;
				name: string;
				status: string;
				category: string;
				components: Record<string, unknown>[];
			}[];

			return templates;
		} catch (err) {
			return [];
		}
	}
	static async fetchTemplate(template_id: string) {
		try {
			const { data } = await api.get(`/template/${template_id}`);

			return data.template as {
				id: string;
				name: string;
				status: string;
				category: string;
				components: Record<string, unknown>[];
			};
		} catch (err) {
			return null;
		}
	}

	static async removeTemplate(id: string, name: string) {
		await api.post(`/template/delete-template`, {
			id,
			name,
		});
	}

	static async addTemplate(template: Record<string, unknown>) {
		let error = '';
		try {
			const { data } = await api.post(`/template/add-template`, template);
			if (data.error) {
				error = data.error;
			}
		} catch (err) {
			throw new Error('Unable to add template');
		}
		if (error) {
			throw new Error(error);
		}
	}

	static async editTemplate(template: Record<string, unknown>) {
		let error = '';
		try {
			const { data } = await api.post(`/template/edit-template`, template);
			if (data.error) {
				error = data.error;
			}
		} catch (err) {
			throw new Error('Unable to add template');
		}
		if (error) {
			throw new Error(error);
		}
	}
}
