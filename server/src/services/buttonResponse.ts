import { Types } from 'mongoose';
import { ButtonResponseDB, PhoneBookDB } from '../../mongo';
import IAccount from '../../mongo/types/account';
import IWhatsappLink from '../../mongo/types/whatsappLink';
import DateUtils from '../utils/DateUtils';
import ConversationService from './conversation';
import WhatsappLinkService from './whatsappLink';

type CreateResponse = {
	button_id?: string;
	button_text: string;
	recipient: string;
	context_meta_message_id: string;
	responseAt: Date;
};

function processDocs(docs: any[]) {
	return docs.map((doc) => {
		return {
			button_id: (doc.button_id as string) ?? '',
			button_text: (doc.button_text as string) ?? '',
			recipient: (doc.recipient as string) ?? '',
			responseAt: (DateUtils.getMoment(doc.responseAt).format('YYYY-MM-DD') as string) ?? '',
			name: (doc.name as string) ?? '',
			email: (doc.email as string) ?? '',
		};
	});
}

export default class ButtonResponseService extends WhatsappLinkService {
	private conversationService: ConversationService;
	public constructor(account: IAccount, whatsappLink: IWhatsappLink) {
		super(account, whatsappLink);
		this.conversationService = new ConversationService(account, whatsappLink);
	}

	public async createResponse(details: CreateResponse) {
		const { button_id, button_text, recipient, context_meta_message_id, responseAt } = details;
		if (!context_meta_message_id) return;
		const message = await this.conversationService.getConversationMessageByMetaId(
			context_meta_message_id
		);
		if (!message) return;
		try {
			await ButtonResponseDB.create({
				linked_to: this.userId,
				device_id: this.deviceId,
				button_id,
				button_text,
				recipient,
				meta_message_id: context_meta_message_id,
				message_id: message._id,
				responseAt,
				scheduler_id: message.scheduled_by.id,
				scheduler_name: message.scheduled_by.name,
			});
		} catch (e) {}
	}

	public async getResponses(id: Types.ObjectId) {
		const docs = await ButtonResponseDB.aggregate([
			{
				$match: {
					linked_to: this.userId,
					device_id: this.deviceId,
					scheduler_id: id,
				},
			},
			{
				$lookup: {
					from: PhoneBookDB.collection.name,
					localField: 'recipient',
					foreignField: 'phone_number',
					as: 'phonebook',
				},
			},
			{
				$unwind: {
					path: '$phonebook',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$addFields: {
					name: {
						$concat: [
							{
								$cond: {
									if: { $ne: ['$phonebook.first_name', ''] },
									then: '$phonebook.first_name',
									else: '',
								},
							},
							{
								$cond: {
									if: { $ne: ['$phonebook.middle_name', ''] },
									then: {
										$concat: [' ', '$phonebook.middle_name'],
									},
									else: '',
								},
							},
							{
								$cond: {
									if: { $ne: ['$phonebook.last_name', ''] },
									then: {
										$concat: [' ', '$phonebook.last_name'],
									},
									else: '',
								},
							},
						],
					},
					email: '$phonebook.email',
				},
			},
			{
				$project: {
					_id: 0,
					button_id: 1,
					button_text: 1,
					recipient: 1,
					responseAt: 1,
					name: 1,
					email: 1,
				},
			},
		]);

		return processDocs(docs);
	}
}
