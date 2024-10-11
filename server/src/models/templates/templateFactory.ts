import axios from 'axios';
import MetaAPI from '../../config/MetaAPI';
import Template from './template';

type WhatsappDevice = {
	accessToken: string;
	waid: string;
	phoneNumberId: string;
};

export default class TemplateFactory {
	static convertToTemplate(data: any) {
		const template = new Template();
		template.setId(data.id).setName(data.name).setStatus(data.status).setCategory(data.category);

		for (const component of data.components) {
			switch (component.type) {
				case 'HEADER':
					template.setHeader(component);
					break;
				case 'BODY':
					template.setBody(component);
					break;
				case 'FOOTER':
					template.setFooter(component);
					break;
				case 'CAROUSEL':
					template.setCarousel(component);
					break;
				case 'BUTTONS':
					template.setButtons(component.buttons);
					break;
			}
		}
		return template;
	}

	static async find(whatsappLinkService: WhatsappDevice) {
		try {
			const {
				data: { data },
			} = await MetaAPI(whatsappLinkService.accessToken).get(
				`/${whatsappLinkService.waid}/message_templates`
			);

			return data.map((template: any) => TemplateFactory.convertToTemplate(data));
		} catch (err) {
			return [];
		}
	}

	static async findById(whatsappLinkService: WhatsappDevice, id: string) {
		try {
			const { data } = await MetaAPI(whatsappLinkService.accessToken).get(`/${id}`);
			return TemplateFactory.convertToTemplate(data);
		} catch (err) {
			return null;
		}
	}

	static async findByName(whatsappLinkService: WhatsappDevice, name: string) {
		try {
			const { data: res } = await MetaAPI(whatsappLinkService.accessToken).get(
				`/${whatsappLinkService.waid}/message_templates?name=${name}`
			);
			let data = res.data.find((template: any) => template.name === name);
			return data ? TemplateFactory.convertToTemplate(data) : null;
		} catch (err) {
			return null;
		}
	}

	public static async saveTemplate(device: WhatsappDevice, template: Template) {
		const details = template.buildToSave();
		const promise = template.id
			? MetaAPI(device.accessToken).post(`/${device.waid}/message_templates`, details)
			: MetaAPI(device.accessToken).post(`/${template.id}`, details);
		try {
			await promise;
		} catch (err) {
			if (axios.isAxiosError(err)) {
				return (err.response as any).data.error.error_user_msg;
			}
			return 'An error occurred';
		}
	}

	public static async deleteTemplate(device: WhatsappDevice, id: string, name: string) {
		try {
			await MetaAPI(device.accessToken).delete(
				`/${device.waid}/message_templates?hsm_id=${id}&name=${name}`
			);
			return true;
		} catch (err: any) {
			return false;
		}
	}
}
