import { ButtonResponseDB } from '../../mongo';
import IAccount from '../../mongo/types/account';
import IWhatsappLink from '../../mongo/types/whatsappLinks';
import ConversationService from './conversation';
import WhatsappLinkService from './whatsappLink';

type CreateResponse = {
	button_id?: string;
	button_text: string;
	recipient: string;
	meta_message_id: string;
	responseAt: Date;
};

export default class ButtonResponseService extends WhatsappLinkService {
	private conversationService: ConversationService;
	public constructor(account: IAccount, whatsappLink: IWhatsappLink) {
		super(account, whatsappLink);
		this.conversationService = new ConversationService(account, whatsappLink);
	}

	public async createResponse(details: CreateResponse) {
		const { button_id, button_text, recipient, meta_message_id, responseAt } = details;
		const message = await this.conversationService.getConversationMessageByMetaId(meta_message_id);
		if (!message) return;
		await ButtonResponseDB.create({
			linked_to: this.userId,
			device_id: this.deviceId,
			button_id,
			button_text,
			recipient,
			meta_message_id,
			message_id: message._id,
			responseAt,
			scheduler_id: message.scheduled_by.id,
			scheduler_name: message.scheduled_by.name,
		});
	}
}
