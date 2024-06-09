import { NextFunction, Request, Response } from 'express';
import { AccountDB } from '../../../mongo';
import { WhatsappLinkDB } from '../../../mongo/repo';
import { META_VERIFY_STRING, META_VERIFY_USER_STRING } from '../../config/const';
import BroadcastService from '../../services/broadcast';
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

	if (data.statuses) {
		//Handle outgoing messages status

		const status = data.statuses[0];
		const msgID = status.id;
		const error: string = status.errors?.[0]?.error_data?.details || '';
		// const conversationID = status.conversation.id;
		// const conversationExpiry = status.conversation.expiration_timestamp;
		// const origin = status.conversation.origin.type;
		BroadcastService.updateStatus(msgID, status.status, status.timestamp, error);
	} else {
		// const recipient_id = data.contacts[0].recipient_id;

		const link = await WhatsappLinkDB.findOne({ waid, phoneNumberId: phone_number_id });
		if (!link) {
			return res.status(400);
		}

		const user = await AccountDB.findOne({ _id: link.linked_to });
		if (!user) {
			return res.status(400);
		}
	}

	return res.status(200);
}

const Controller = {
	whatsappCallback,
	whatsappVerification,
};

export default Controller;
