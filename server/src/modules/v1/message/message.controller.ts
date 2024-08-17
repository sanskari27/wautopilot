import { NextFunction, Request, Response } from 'express';
import MetaAPI from '../../../config/MetaAPI';
import { CustomError } from '../../../errors';
import COMMON_ERRORS from '../../../errors/common-errors';
import ConversationService from '../../../services/conversation';
import { Respond } from '../../../utils/ExpressUtils';
import { SendMessageValidationResult } from './message.validator';

async function sendMessage(req: Request, res: Response, next: NextFunction) {
	const {
		serviceAccount,
		serviceUser,
		device: { device },
	} = req.locals;
	const data = req.locals.data as SendMessageValidationResult;

	const conversationService = new ConversationService(serviceAccount, device);
	const recipient = await conversationService.createConversation(data.recipient);
	const { type, ...message } = data.message;
	const msgObj = {
		messaging_product: 'whatsapp',
		to: data.recipient,
		type,
		[type]:
			type === 'text'
				? {
						body: data.message.text,
				  }
				: type === 'location'
				? data.message.location
				: type === 'contacts'
				? data.message.contacts
				: {
						id: data.message.media_id,
				  },
		context: data.context,
	};

	try {
		const { data: res } = await MetaAPI(device.accessToken).post(
			`/${device.phoneNumberId}/messages`,
			msgObj
		);
		await conversationService.addMessageToConversation(recipient._id, {
			message_id: res.messages[0].id,
			recipient: data.recipient,
			body: {
				body_type:
					type === 'text'
						? 'TEXT'
						: type === 'contacts'
						? 'CONTACT'
						: type === 'location'
						? 'LOCATION'
						: 'MEDIA',
				...message,
			},
			...(data.context
				? {
						context: {
							id: data.context.message_id,
						},
				  }
				: {}),
		});
		serviceUser.deductCredit(1);
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR));
	}

	return Respond({
		res,
		status: 200,
	});
}

const Controller = {
	sendMessage,
};

export default Controller;
