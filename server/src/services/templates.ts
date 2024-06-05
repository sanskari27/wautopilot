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
}
