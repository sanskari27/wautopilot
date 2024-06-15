import { Types } from 'mongoose';
import { ConversationDB, ConversationMessageDB } from '../../mongo';
import IAccount from '../../mongo/types/account';
import IConversation from '../../mongo/types/conversation';
import IConversationMessage from '../../mongo/types/conversationmessage';
import IWhatsappLink from '../../mongo/types/whatsapplink';
import { MESSAGE_STATUS } from '../config/const';
import SocketServer from '../socket';
import DateUtils from '../utils/DateUtils';
import { filterUndefinedKeys } from '../utils/ExpressUtils';
import WhatsappLinkService from './whatsappLink';

function processConversationDocs(docs: IConversation[]) {
	return docs.map((doc) => ({
		_id: doc._id,
		recipient: doc.recipient,
		profile_name: doc.profile_name ?? '',
		expiration_timestamp: doc.expiration_timestamp,
		origin: doc.origin ?? '',
	}));
}

function processConversationMessages(docs: IConversationMessage[]) {
	return docs.map((doc) => ({
		_id: doc._id,
		recipient: doc.recipient,
		message_id: doc.message_id,
		header_type: doc.header_type,
		header_content_source: doc.header_content_source,
		header_content: doc.header_content,
		body: doc.body,
		footer_content: doc.footer_content,
		buttons: doc.buttons,
		received_at: doc.received_at,
		delivered_at: doc.delivered_at,
		read_at: doc.read_at,
		sent_at: doc.sent_at,
		failed_at: doc.failed_at,
		failed_reason: doc.failed_reason,
		seen_at: doc.seen_at,
		status: doc.status,
		context: doc.context,
	}));
}

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

	public async findConversation(recipient: string) {
		const doc = await ConversationDB.findOne({
			linked_to: this.userId,
			recipient,
		});
		if (!doc) return null;
		return processConversationDocs([doc])[0];
	}

	public async findConversationByID(id: Types.ObjectId) {
		const doc = await ConversationDB.findOne({
			linked_to: this.userId,
			_id: id,
		});
		if (!doc) return null;
		return processConversationDocs([doc])[0];
	}

	public async addMessageToConversation(
		conversation_id: Types.ObjectId,
		details: {
			recipient: string;
			message_id: string;
			header_type?: string;
			header_content_source?: string;
			header_content?: string;
			body?: Partial<IConversationMessage['body']>;
			footer_content?: string;
			buttons?: IConversationMessage['buttons'];
			received_at?: Date;
			status?: MESSAGE_STATUS;
			context?: {
				from?: string;
				id: string;
			};
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
					$set: {
						last_message_at: details.received_at,
					},
				}
			);

			const data = processConversationMessages([doc])[0];
			SocketServer.getInstance().sendMessage(conversation_id.toString(), data);

			return data;
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
		recipient: string,
		details: Partial<{
			meta_conversation_id: string;
			conversationExpiry: number;
			origin: string;
			profile_name: string;
		}>
	) {
		await ConversationDB.updateOne(
			{
				recipient: recipient,
			},
			{
				$set: filterUndefinedKeys(details),
			}
		);
	}

	public async markMessageRead(message_id: string) {
		await ConversationMessageDB.updateOne(
			{
				linked_to: this.userId,
				device_id: this.whatsappLink._id,
				message_id,
			},
			{
				$set: {
					read_at: new Date(),
					status: MESSAGE_STATUS.READ,
				},
			}
		);
	}

	public async fetchConversations() {
		const docs = await ConversationDB.find({
			linked_to: this.userId,
			device_id: this.whatsappLink._id,
		}).sort({ last_message_at: -1 });

		return processConversationDocs(docs);
	}

	public async fetchConversationMessages(conversation_id: Types.ObjectId) {
		const docs = await ConversationMessageDB.find({
			linked_to: this.userId,
			device_id: this.whatsappLink._id,
			conversation_id,
		}).sort({ createdAt: -1 });

		return processConversationMessages(docs);
	}
}
