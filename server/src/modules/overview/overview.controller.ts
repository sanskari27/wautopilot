import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../../errors';
import COMMON_ERRORS from '../../errors/common-errors';
import ConversationService from '../../services/conversation';
import MediaService from '../../services/media';
import PhoneBookService from '../../services/phonebook';
import SchedulerService from '../../services/scheduler';
import WhatsappLinkService from '../../services/whatsappLink';
import { Respond } from '../../utils/ExpressUtils';

async function dashboardDetails(req: Request, res: Response, next: NextFunction) {
	const {
		serviceAccount: account,
		device: { device },
	} = req.locals;
	try {
		const conversation = new ConversationService(account, device);
		const scheduler = new SchedulerService(account, device);
		const whatsappLink = new WhatsappLinkService(account, device);
		const phoneBook = new PhoneBookService(account);
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
