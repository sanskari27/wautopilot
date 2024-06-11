import { NextFunction, Request, Response } from 'express';
import { AccountDB, WhatsappLinkDB } from '../../../mongo';
import { MESSAGE_STATUS, META_VERIFY_STRING, META_VERIFY_USER_STRING } from '../../config/const';
import BroadcastService from '../../services/broadcast';
import ConversationService from '../../services/conversation';
import DateUtils from '../../utils/DateUtils';
export const JWT_EXPIRE_TIME = 3 * 60 * 1000;
export const SESSION_EXPIRE_TIME = 28 * 24 * 60 * 60 * 1000;

async function whatsappVerification(req: Request, res: Response, next: NextFunction) {
	const mode = req.query['hub.mode'];
	const challenge = req.query['hub.challenge'];
	const token = req.query['hub.verify_token'];

	if (mode === 'subscribe' && (token === META_VERIFY_STRING || token === META_VERIFY_USER_STRING)) {
		return res.status(200).send(challenge);
	}
	return res.status(403).send('Forbidden');
}

async function whatsappCallback(req: Request, res: Response, next: NextFunction) {
	const body = req.body;
	if (body.object !== 'whatsapp_business_account') {
		return res.status(400);
	}
	const data = body.entry[0].changes[0].value;
	const waid = body.entry[0].id;
	const phone_number_id = data.metadata.phone_number_id;

	const link = await WhatsappLinkDB.findOne({ waid, phoneNumberId: phone_number_id });
	if (!link) {
		return res.status(400);
	}

	const user = await AccountDB.findOne({ _id: link.linked_to });
	if (!user) {
		return res.status(400);
	}
	const conversationService = new ConversationService(user, link);

	if (data.statuses) {
		//Handle outgoing messages status

		const status = data.statuses[0];
		const msgID = status.id;
		const error: string = status.errors?.[0]?.error_data?.details || '';
		// const conversationID = status.conversation.id;
		// const conversationExpiry = status.conversation.expiration_timestamp;
		// const origin = status.conversation.origin.type;
		BroadcastService.updateStatus(msgID, status.status, status.timestamp, error);
		ConversationService.updateStatus(msgID, status.status, status.timestamp, error);
		console.log({
			msgID,
			status,
		});
		if (status.conversation) {
			ConversationService.updateConversationDetails(msgID, {
				meta_conversation_id: status.conversation.id,
				conversationExpiry: status.conversation.expiration_timestamp,
				origin: status.conversation.origin.type,
			});
		}
	} else {
		const message = data.messages[0];
		const msgID = message.id;
		const recipient = message.from;
		const timestamp = DateUtils.fromUnixTime(message.timestamp).toDate();

		const conversation_id = await conversationService.createConversation(recipient);

		if (message.type === 'text') {
			conversationService.addMessageToConversation(conversation_id, {
				message_id: msgID,
				recipient,
				body: {
					body_type: 'TEXT',
					text: message.text.body,
				},
				received_at: timestamp,
				status: MESSAGE_STATUS.DELIVERED,
			});
		} else if (
			message.type === 'image' ||
			message.type === 'video' ||
			message.type === 'document' ||
			message.type === 'audio'
		) {
			conversationService.addMessageToConversation(conversation_id, {
				message_id: msgID,
				recipient,
				body: {
					body_type: 'MEDIA',
					media_id: message.image.id,
					caption: message.image.caption,
				},
				received_at: timestamp,
				status: MESSAGE_STATUS.DELIVERED,
			});
		} else if (message.contacts && message.contacts.length > 0) {
			conversationService.addMessageToConversation(conversation_id, {
				message_id: msgID,
				recipient,
				body: {
					body_type: 'CONTACT',
					contacts: message.contacts,
				},
				received_at: timestamp,
				status: MESSAGE_STATUS.DELIVERED,
			});
		} else if (message.location) {
			conversationService.addMessageToConversation(conversation_id, {
				message_id: msgID,
				recipient,
				body: {
					body_type: 'LOCATION',
					location: message.location,
				},
				received_at: timestamp,
				status: MESSAGE_STATUS.DELIVERED,
			});
		} else {
			conversationService.addMessageToConversation(conversation_id, {
				message_id: msgID,
				recipient,
				body: {
					body_type: 'UNKNOWN',
				},
				received_at: timestamp,
				status: MESSAGE_STATUS.DELIVERED,
			});
		}
	}

	return res.status(200);
}

const Controller = {
	whatsappCallback,
	whatsappVerification,
};

export default Controller;
