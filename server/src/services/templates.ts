import IAccount from '../../mongo/types/account';
import IWhatsappLink from '../../mongo/types/whatsappLink';
import MetaAPI from '../config/MetaAPI';
import {
	BodyTemplate,
	ButtonsTemplate,
	FooterTemplate,
	HeaderTemplate,
	Template,
} from '../types/template';
import WhatsappLinkService from './whatsappLink';

export default class TemplateService extends WhatsappLinkService {
	public constructor(account: IAccount, whatsappLink: IWhatsappLink) {
		super(account, whatsappLink);
	}

	public async addTemplate(details: Template) {
		try {
			await MetaAPI(this.accessToken).post(`/${this.waid}/message_templates`, details);
			return true;
		} catch (err) {
			return false;
		}
	}

	public async editTemplate(id: string, details: Template) {
		try {
			await MetaAPI(this.accessToken).post(`/${id}`, details);
			return true;
		} catch (err) {
			return false;
		}
	}

	public async fetchTemplates() {
		try {
			const {
				data: { data },
			} = await MetaAPI(this.accessToken).get(`/${this.waid}/message_templates`);

			return data.map((template: any) => ({
				id: template.id,
				name: template.name,
				status: template.status as 'APPROVED' | 'PENDING' | 'REJECTED',
				category: template.category as 'AUTHENTICATION' | 'MARKETING' | 'UTILITY',
				components: template.components as (
					| HeaderTemplate
					| BodyTemplate
					| FooterTemplate
					| ButtonsTemplate
				)[],
			})) as Template[];
		} catch (err) {
			return [];
		}
	}

	public async fetchTemplate(id: string) {
		try {
			const { data } = await MetaAPI(this.accessToken).get(`/${id}`);

			return {
				id: data.id,
				name: data.name,
				status: data.status as 'APPROVED' | 'PENDING' | 'REJECTED',
				category: data.category as 'AUTHENTICATION' | 'MARKETING' | 'UTILITY',
				components: data.components as (
					| HeaderTemplate
					| BodyTemplate
					| FooterTemplate
					| ButtonsTemplate
				)[],
			} as Template & {
				id: string;
				status: 'APPROVED' | 'PENDING' | 'REJECTED';
			};
		} catch (err) {
			return null;
		}
	}

	public async fetchTemplateByName(name: string) {
		try {
			const { data: res } = await MetaAPI(this.accessToken).get(
				`/${this.waid}/message_templates?name=${name}`
			);
			let data;

			for (const template of res.data) {
				if (template.name === name) {
					data = template;
					break;
				}
			}

			return {
				id: data.id,
				name: data.name,
				status: data.status as 'APPROVED' | 'PENDING' | 'REJECTED',
				category: data.category as 'AUTHENTICATION' | 'MARKETING' | 'UTILITY',
				components: data.components as (
					| HeaderTemplate
					| BodyTemplate
					| FooterTemplate
					| ButtonsTemplate
				)[],
			} as Template & {
				id: string;
				status: 'APPROVED' | 'PENDING' | 'REJECTED';
			};
		} catch (err) {
			return null;
		}
	}

	public async deleteTemplate(template_id: string, name: string) {
		try {
			await MetaAPI(this.accessToken).delete(
				`/${this.waid}/message_templates?hsm_id=${template_id}&name=${name}`
			);
			return true;
		} catch (err: any) {
			return false;
		}
	}

	public async sendTemplateMessage(
		template_name: string,
		to: string[],
		components: (
			| {
					type: 'HEADER';
					parameters:
						| {
								type: 'text';
								text: string;
						  }
						| {
								type: 'image';
								image: {
									link: string;
								};
						  };
			  }
			| {
					type: 'BODY';
					parameters: {
						type: 'text';
						text: string;
					}[];
			  }
		)[]
	) {
		const promises = to.map(async (phone) => {
			try {
				await MetaAPI(this.accessToken).post(`/${this.phoneNumberId}/messages`, {
					messaging_product: 'whatsapp',
					to: phone,
					type: 'template',
					template: {
						name: template_name,
						language: {
							code: 'en_US',
						},
						components,
					},
				});

				return true;
			} catch (err) {
				return false;
			}
		});

		const success = await Promise.all(promises);
		this.deductCredit(success.length);
		return success.every((s) => s);
	}
}
