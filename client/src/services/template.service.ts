import APIInstance from '../config/APIInstance';

export default class TemplateService {
	static async listTemplates(device_id: string) {
		try {
			const { data } = await APIInstance.get(`/template/${device_id}`);

			const templates = data.templates as {
				id: string;
				name: string;
				status: string;
				category: string;
			}[];

			return templates;
		} catch (err) {
			return [];
		}
	}
	static async fetchTemplate(device_id: string, template_id: string) {
		try {
			const { data } = await APIInstance.get(`/template/${device_id}/${template_id}`);

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

	static async removeTemplate(device_id: string, id: string, name: string) {
		try {
			await APIInstance.post(`/template/${device_id}/delete-template`, {
				id,
				name,
			});
			return true;
		} catch (err) {
			return false;
		}
	}

	static async addTemplate(device_id: string, template: Record<string, unknown>) {
		await APIInstance.post(`/template/${device_id}/add-template`, template);
	}

	static async editTemplate(device_id: string, template: Record<string, unknown>) {
		await APIInstance.post(`/template/${device_id}/edit-template`, template);
	}
}
