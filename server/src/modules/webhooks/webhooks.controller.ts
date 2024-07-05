import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { AccountDB, WhatsappLinkDB } from '../../../mongo';
import IAccount from '../../../mongo/types/account';
import IWhatsappLink from '../../../mongo/types/whatsappLink';
import {
	MESSAGE_STATUS,
	META_VERIFY_STRING,
	META_VERIFY_USER_STRING,
	RAZORPAY_WEBHOOK_SECRET,
} from '../../config/const';
import BroadcastService from '../../services/broadcast';
import ButtonResponseService from '../../services/buttonResponse';
import ChatBotService from '../../services/chatbot';
import ConversationService from '../../services/conversation';
import DateUtils from '../../utils/DateUtils';

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
		return res.status(400).send("Resource doesn't exist");
	}

	const user = await AccountDB.findOne({ _id: link.linked_to });
	if (!user) {
		return res.status(400).send("Resource doesn't exist");
	}
	const conversationService = new ConversationService(user, link);
	const contact = data.contacts?.[0] ?? {
		wa_id: '',
		profile: {
			name: '',
		},
	};

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

		if (status.conversation) {
			ConversationService.updateConversationDetails(msgID, {
				meta_conversation_id: status.conversation.id,
				conversationExpiry: status.conversation.expiration_timestamp,
				origin: status.conversation.origin.type,
			});
		}
	} else {
		const message = data.messages[0];
		const meta_message_id = message.id;
		const recipient = message.from;
		if (data.contacts && data.contacts.length > 0) {
			conversationService.updateConversationDetails(contact.wa_id, {
				profile_name: contact.profile.name,
			});
		}

		const c_id = await conversationService.createConversation(recipient, contact.profile.name);

		processIncomingMessage({
			user,
			link,
			message,
			conversation_id: c_id,
			meta_message_id: meta_message_id,
			recipient,
		});
	}

	return res.status(200).send('OK');
}

async function test() {
	const waid = '171113502760309';
	const phone_number_id = '158944380644785';

	const link = await WhatsappLinkDB.findOne({ waid, phoneNumberId: phone_number_id });
	if (!link) {
		return;
	}

	const user = await AccountDB.findOne({ _id: link.linked_to });
	if (!user) {
		return;
	}
	const chatBotService = new ChatBotService(user, link);
	chatBotService.checkForFlowKeyword(
		'916205667548',
		// 'wamid.HBgMOTE2MjA1NjY3NTQ4FQIAEhgWM0VCMEVBRUZBMkVBNUE0NEUzQjE2MwA=',
		'asdaaaasdaa'
	);
}
test();

async function razorpayPayment(req: Request, res: Response) {
	const data = req.body;
	const digest = crypto
		.createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
		.update(JSON.stringify(req.body))
		.digest('hex');

	const razorpay_signature = req.headers['x-razorpay-signature'];

	if (razorpay_signature !== digest) {
		return res.status(400).json({ status: 'Bad signature' });
	} else if (!data.contains.includes('payment')) {
		return res.status(400).json({ status: 'Bad Request' });
	}
	// const payment = data.payload.payment.entity;
	// const { id: payment_id, order_id, status } = payment;

	// if (status !== 'captured') {
	// 	return res.status(400).json({ status: 'Bad Request' });
	// }
	try {
		// const bucketService = await PaymentBucketService.getBucketByOrderID(order_id);
		// bucketService.getPaymentService().confirmOneTimePayment(order_id, payment_id);
		res.status(200).json({ status: 'OK' });
	} catch (err) {
		return res.status(404).json({ status: 'Not Found' });
	}
}

const Controller = {
	whatsappCallback,
	whatsappVerification,
	razorpayPayment,
};

export default Controller;

function processIncomingMessage(details: {
	message: any;
	user: IAccount;
	link: IWhatsappLink;
	conversation_id: Types.ObjectId;
	meta_message_id: string;
	recipient: string;
}) {
	const { message, user, link, conversation_id, meta_message_id, recipient } = details;
	const conversationService = new ConversationService(user, link);
	const chatBotService = new ChatBotService(user, link);
	const buttonResponseService = new ButtonResponseService(user, link);
	const timestamp = DateUtils.fromUnixTime(message.timestamp).toDate();

	if (message.type === 'text') {
		conversationService.addMessageToConversation(conversation_id, {
			message_id: meta_message_id,
			recipient,
			body: {
				body_type: 'TEXT',
				text: message.text.body,
			},
			received_at: timestamp,
			status: MESSAGE_STATUS.DELIVERED,
			context: message.context,
		});
		chatBotService.handleMessage(recipient, message.text.body);
		chatBotService.checkForFlowKeyword(recipient, message.text.body);
	} else if (
		message.type === 'image' ||
		message.type === 'video' ||
		message.type === 'document' ||
		message.type === 'audio'
	) {
		conversationService.addMessageToConversation(conversation_id, {
			message_id: meta_message_id,
			recipient,
			body: {
				body_type: 'MEDIA',
				media_id: message[message.type].id,
				caption: message[message.type].caption,
			},
			received_at: timestamp,
			status: MESSAGE_STATUS.DELIVERED,
			context: message.context,
		});
	} else if (message.contacts && message.contacts.length > 0) {
		conversationService.addMessageToConversation(conversation_id, {
			message_id: meta_message_id,
			recipient,
			body: {
				body_type: 'CONTACT',
				contacts: message.contacts,
			},
			received_at: timestamp,
			status: MESSAGE_STATUS.DELIVERED,
			context: message.context,
		});
	} else if (message.type === 'button') {
		conversationService.addMessageToConversation(conversation_id, {
			message_id: meta_message_id,
			recipient,
			body: {
				body_type: 'TEXT',
				text: message.button.text,
			},
			received_at: timestamp,
			status: MESSAGE_STATUS.DELIVERED,
			context: message.context,
		});
		chatBotService.handleMessage(recipient, message.button.text);
		buttonResponseService.createResponse({
			button_text: message.button.text,
			recipient,
			context_meta_message_id: message.context.id,
			responseAt: timestamp,
		});
	} else if (message.location) {
		conversationService.addMessageToConversation(conversation_id, {
			message_id: meta_message_id,
			recipient,
			body: {
				body_type: 'LOCATION',
				location: message.location,
			},
			received_at: timestamp,
			status: MESSAGE_STATUS.DELIVERED,
			context: message.context,
		});
	} else if (message.interactive && message.interactive.type === 'list_reply') {
		conversationService.addMessageToConversation(conversation_id, {
			message_id: meta_message_id,
			recipient,
			body: {
				body_type: 'TEXT',
				text: message.interactive?.list_reply?.title ?? '',
			},
			received_at: timestamp,
			status: MESSAGE_STATUS.DELIVERED,
			context: message.context,
		});
		chatBotService.handleMessage(recipient, message.interactive?.list_reply?.title ?? '');
		chatBotService.checkForFlowKeyword(recipient, message.interactive?.list_reply?.title ?? '');
		chatBotService.continueFlow(
			recipient,
			message.context.id,
			message.interactive?.list_reply?.id ?? ''
		);
	} else if (message.interactive && message.interactive.type === 'button_reply') {
		const button_reply = message.interactive.button_reply;
		conversationService.addMessageToConversation(conversation_id, {
			message_id: meta_message_id,
			recipient,
			body: {
				body_type: 'TEXT',
				text: button_reply.title ?? '',
			},
			received_at: timestamp,
			status: MESSAGE_STATUS.DELIVERED,
			context: message.context,
		});
		chatBotService.handleMessage(recipient, button_reply?.title ?? '');
		chatBotService.checkForFlowKeyword(recipient, button_reply?.title ?? '');
		chatBotService.continueFlow(recipient, message.context.id, button_reply.id ?? '');
		buttonResponseService.createResponse({
			button_id: button_reply.id,
			button_text: button_reply.title,
			recipient,
			context_meta_message_id: message.context.id,
			responseAt: timestamp,
		});
	} else {
		conversationService.addMessageToConversation(conversation_id, {
			message_id: meta_message_id,
			recipient,
			body: {
				body_type: 'UNKNOWN',
			},
			received_at: timestamp,
			status: MESSAGE_STATUS.DELIVERED,
			context: message.context,
		});
	}
}
