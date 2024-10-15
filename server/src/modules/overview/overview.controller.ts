import { NextFunction, Request, Response } from 'express';
import { Cookie } from '../../config/const';
import { AUTH_ERRORS, CustomError } from '../../errors';
import COMMON_ERRORS from '../../errors/common-errors';
import ContactService from '../../services/contacts';
import ConversationService from '../../services/conversation';
import MediaService from '../../services/media';
import MessageScheduler from '../../services/messageScheduler';
import PhoneBookService from '../../services/phonebook';
import WhatsappLinkService from '../../services/whatsappLink';
import { Respond } from '../../utils/ExpressUtils';

async function dashboardDetails(req: Request, res: Response, next: NextFunction) {
	const { serviceAccount: account } = req.locals;

	const device_id = req.cookies[Cookie.Device];

	try {
		const phoneBook = new PhoneBookService(account);
		const contactService = new ContactService(account);

		if (!device_id) {
			return Respond({
				res,
				status: 200,
				data: {
					conversations: [],
					pendingToday: 0,
					health: 'N/A',
					messages: [],
					phoneRecords: await phoneBook.totalRecords(),
					contacts: await contactService.totalContacts(),
					mediaSize: 0,
				},
			});
		}

		const device = await WhatsappLinkService.fetchDeviceDoc(device_id, account._id);
		if (!device) {
			return next(new CustomError(AUTH_ERRORS.DEVICE_NOT_FOUND));
		}

		const conversation = new ConversationService(account, device);
		const scheduler = new MessageScheduler(account._id, device._id);
		const whatsappLink = new WhatsappLinkService(account, device);
		const media = new MediaService(account, device);

		return Respond({
			res,
			status: 200,
			data: {
				conversations: await conversation.monthlyStartedConversations(),
				pendingToday: await scheduler.pendingTodayCount(),
				health: await whatsappLink.fetchMessageHealth(),
				messages: await conversation.dailySentMessages(),
				phoneRecords: await phoneBook.totalRecords(),
				contacts: await contactService.totalContacts(),
				mediaSize: await media.totalMediaStorage(),
			},
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR));
	}
}

const Controller = {
	dashboardDetails,
};

export default Controller;
