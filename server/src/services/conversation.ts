import { Types } from 'mongoose';
import { ConversationDB, ConversationMessageDB } from '../../mongo';
import IAccount from '../../mongo/types/account';
import IConversationMessage from '../../mongo/types/conversationmessage';
import IWhatsappLink from '../../mongo/types/whatsapplink';
import { MESSAGE_STATUS } from '../config/const';
import DateUtils from '../utils/DateUtils';
import { filterUndefinedKeys } from '../utils/ExpressUtils';
import WhatsappLinkService from './whatsappLink';

export default class ConversationService extends WhatsappLinkService {
	private whatsappLink: IWhatsappLink;
	public constructor(account: IAccount, whatsappLink: IWhatsappLink) {
		super(account);
		this.whatsappLink = whatsappLink;
	}

	public async createConversation(recipient: string) {
		try {
			const doc = await ConversationDB.create({
				linked_to: this.userId,
				device_id: this.whatsappLink._id,
				recipient,
			});
			return doc._id;
		} catch (err) {
			const doc = await ConversationDB.findOne({
				linked_to: this.userId,
				device_id: this.whatsappLink._id,
				recipient,
			});
			return doc!._id;
		}
	}

	public async updateConversation(
		recipient: string,
		details: {
			profile_name: string;
			meta_conversation_id: string;
			expiration_timestamp: Date;
			origin: string;
		}
	) {
		await ConversationDB.updateMany(
			{
				linked_to: this.userId,
				recipient,
			},
			{
				$set: details,
			}
		);
	}

	public findConversation(recipient: string) {
		return ConversationDB.find({
			linked_to: this.userId,
			recipient,
		});
	}

	public async addMessageToConversation(
		conversation_id: Types.ObjectId,
		details: {
			recipient: string;
			message_id: string;
			header_type?: string;
			header_content?: string;
			body?: Partial<IConversationMessage['body']>;
			footer_content?: string;
			buttons?: IConversationMessage['buttons'];
			received_at?: Date;
			status?: MESSAGE_STATUS;
		}
	) {
		try {
			const doc = await ConversationMessageDB.create({
				linked_to: this.userId,
				device_id: this.whatsappLink._id,
				conversation_id,
				status: details.status ?? MESSAGE_STATUS.PROCESSING,
				...filterUndefinedKeys(details),
			});

			await ConversationDB.updateOne(
				{
					_id: conversation_id,
				},
				{
					$push: {
						messages: doc._id,
					},
				}
			);
		} catch (err) {}
	}

	public static async updateStatus(
		msgID: string,
		status: string,
		timestamp: number,
		error?: string
	) {
		const details = {} as Record<string, unknown>;
		if (status === 'sent') {
			details.sent_at = DateUtils.fromUnixTime(timestamp).toDate();
			details.status = MESSAGE_STATUS.SENT;
		} else if (status === 'read') {
			details.read_at = DateUtils.fromUnixTime(timestamp).toDate();
			details.status = MESSAGE_STATUS.READ;
		} else if (status === 'delivered') {
			details.delivered_at = DateUtils.fromUnixTime(timestamp).toDate();
			details.status = MESSAGE_STATUS.DELIVERED;
		} else if (status === 'failed') {
			details.failed_at = DateUtils.fromUnixTime(timestamp).toDate();
			details.status = MESSAGE_STATUS.FAILED;
			details.failed_reason = error;
		}

		await ConversationMessageDB.updateOne(
			{
				message_id: msgID,
			},
			details
		);
	}

	public static async updateConversationDetails(
		msgID: string,
		details: Partial<{
			meta_conversation_id: string;
			conversationExpiry: number;
			origin: string;
			profile_name: string;
		}>
	) {
		const msgDoc = await ConversationMessageDB.findOne({
			message_id: msgID,
		});

		if (!msgDoc) return;

		await ConversationDB.updateOne(
			{
				recipient: msgDoc.recipient,
			},
			{
				$set: filterUndefinedKeys(details),
			}
		);
	}
}
