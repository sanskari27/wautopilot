import IAccount from '../../mongo/types/account';
import IWhatsappLink from '../../mongo/types/whatsapplink';
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
	private whatsappLink: IWhatsappLink;
	public constructor(account: IAccount, whatsappLink: IWhatsappLink) {
		super(account);
		this.whatsappLink = whatsappLink;
	}

	public async addTemplate(details: Template) {
		try {
			await MetaAPI.post(`/${this.whatsappLink.waid}/message_templates`, details, {
				headers: {
					Authorization: `Bearer ${this.whatsappLink.accessToken}`,
				},
			});
			return true;
		} catch (err) {
			return false;
		}
	}

	public async editTemplate(id: string, details: Template) {
		try {
			await MetaAPI.post(`/${id}`, details, {
				headers: {
					Authorization: `Bearer ${this.whatsappLink.accessToken}`,
				},
			});
			return true;
		} catch (err) {
			return false;
		}
	}

	public async fetchTemplates() {
		try {
			const {
				data: { data },
			} = await MetaAPI.get(`/${this.whatsappLink.waid}/message_templates`, {
				headers: {
					Authorization: `Bearer ${this.whatsappLink.accessToken}`,
				},
			});

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
			const { data } = await MetaAPI.get(`/${id}`, {
				headers: {
					Authorization: `Bearer ${this.whatsappLink.accessToken}`,
				},
			});

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
			const { data: res } = await MetaAPI.get(
				`/${this.whatsappLink.waid}/message_templates?name=${name}`,
				{
					headers: {
						Authorization: `Bearer ${this.whatsappLink.accessToken}`,
					},
				}
			);
			const data = res.data[0];

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
			await MetaAPI.delete(
				`/${this.whatsappLink.waid}/message_templates?hsm_id=${template_id}&name=${name}`,
				{
					headers: {
						Authorization: `Bearer ${this.whatsappLink.accessToken}`,
					},
				}
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
				await MetaAPI.post(
					`/${this.whatsappLink.phoneNumberId}/messages`,
					{
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
					},
					{
						headers: {
							Authorization: `Bearer ${this.whatsappLink.accessToken}`,
						},
					}
				);

				return true;
			} catch (err) {
				return false;
			}
		});

		const success = await Promise.all(promises);

		return success.every((s) => s);
	}
}
