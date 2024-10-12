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
					const header = {
						format: component.format,
						text: component.text,
						example:
							component.format === 'TEXT'
								? component.example?.header_text ?? []
								: component.example?.header_handle[0] ?? '',
					};
					template.setHeader(header);
					break;
				case 'BODY':
					const body = {
						text: component.text,
						example: component.example?.body_text[0] || [],
					};
					template.setBody(body);
					break;
				case 'FOOTER':
					const footer = {
						text: component.text,
					};
					template.setFooter(footer);
					break;
				case 'CAROUSEL':
					const carousel = component.cards.map((card: any) => {
						let header = {};
						let body = {};
						let buttons = {};
						for (const component of card.components) {
							switch (component.type) {
								case 'HEADER':
									header = {
										format: component.format,
										example: component.example?.header_handle[0] ?? '',
									};
									break;
								case 'BODY':
									body = {
										text: component.text,
										example: component.example?.body_text[0] ?? [],
									};
									break;

								case 'BUTTONS':
									buttons = component.buttons;
									break;
							}
						}
						return {
							header,
							body,
							buttons,
						};
					});

					template.setCarousel({
						cards: carousel,
					});
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

			return data.map((template: any) => TemplateFactory.convertToTemplate(template));
		} catch (err) {
			console.log(err);

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
		try {
			template.getId()
				? await MetaAPI(device.accessToken).post(`/${template.getId()}`, details)
				: await MetaAPI(device.accessToken).post(`/${device.waid}/message_templates`, details);
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
