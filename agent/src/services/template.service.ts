import APIInstance from '../config/APIInstance';

export default class TemplateService {
	static async listTemplates(device_id: string) {
		try {
			const { data } = await APIInstance.get(`/${device_id}/template`);

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
	static async fetchTemplate(device_id: string, template_id: string) {
		try {
			const { data } = await APIInstance.get(`/${device_id}/template/${template_id}`);

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
		await APIInstance.post(`/${device_id}/template/delete-template`, {
			id,
			name,
		});
	}

	static async addTemplate(device_id: string, template: Record<string, unknown>) {
		let error = '';
		try {
			const { data } = await APIInstance.post(`/${device_id}/template/add-template`, template);
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

	static async editTemplate(device_id: string, template: Record<string, unknown>) {
		let error = '';
		try {
			const { data } = await APIInstance.post(`/${device_id}/template/edit-template`, template);
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
