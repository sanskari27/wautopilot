import api from '@/lib/api';
import { TemplateWithID } from '@/schema/template';

export default class TemplateService {
	static async listTemplates() {
		try {
			const { data } = await api.get(`/template`);

			const templates = data.templates as TemplateWithID[];

			return templates;
		} catch (err) {
			return [];
		}
	}
	static async fetchTemplate(template_id: string) {
		try {
			const { data } = await api.get(`/template/${template_id}`);

			return data.template as TemplateWithID;
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

const templates = {
	id: '560793779628355',
	name: 'sapin40549',
	status: 'REJECTED',
	category: 'MARKETING',
	body: { text: 'qwertyui {{1}}', example: ['asda'] },
	carousel: [
		{
			header: {
				format: 'IMAGE',
				example:
					'https://scontent.whatsapp.net/v/t61.29466-34/442076712_1572018203737367_1757209097769204219_n.jpg?ccb=1-7&_nc_sid=a80384&_nc_ohc=TMkZD4pmDX8Q7kNvgG0e7DW&_nc_ht=scontent.whatsapp.net&edm=AIJs65cEAAAA&_nc_gid=AJuWy-cVqQjWgH_UrdHGEFf&oh=01_Q5AaIFHsmi1g3aLZgykLt-fXldt-Sx_wgP04VE4YRGwfVkWq&oe=67322434',
			},
			body: { text: 'qwrtyuiop {{1}}', example: ['sdasd'] },
			buttons: [
				{ type: 'QUICK_REPLY', text: 'Hello' },
				{ type: 'QUICK_REPLY', text: 'Hello 2' },
			],
		},
		{
			header: {
				format: 'IMAGE',
				example:
					'https://scontent.whatsapp.net/v/t61.29466-34/456049695_868225658746647_2348372313416957380_n.jpg?ccb=1-7&_nc_sid=a80384&_nc_ohc=ARRY-vSIl_UQ7kNvgFrbN7U&_nc_ht=scontent.whatsapp.net&edm=AIJs65cEAAAA&_nc_gid=AJuWy-cVqQjWgH_UrdHGEFf&oh=01_Q5AaIAqpV9crvQ3kXFv1fDziGPhMpEcucLDe1BO6wFw8ISy2&oe=67323D45',
			},
			body: { text: 'asdfghjkl {{1}}', example: ['v fgs'] },
			buttons: [
				{ type: 'QUICK_REPLY', text: 'Hello 3' },
				{ type: 'QUICK_REPLY', text: 'Hello 4' },
			],
		},
	],
};