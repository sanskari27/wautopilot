import { NextFunction, Request, Response } from 'express';
import LinkShortenerService from '../../services/linkShortener';
import { Respond } from '../../utils/ExpressUtils';
import { CreateLinkValidationResult } from './shortener.validator';

async function createLink(req: Request, res: Response, next: NextFunction) {
	const { link, title, type, message, number } = req.locals.data as CreateLinkValidationResult;

	const service = new LinkShortenerService(req.locals.serviceAccount);

	let doc;
	if (type === 'whatsapp') {
		doc = await service.shortenWhatsappLink(title, { phoneNumber: number!, message: message! });
	} else {
		doc = await service.shortenLink(title, link!);
	}

	return Respond({
		res,
		status: 200,
		data: {
			details: doc,
		},
	});
}

async function updateLink(req: Request, res: Response, next: NextFunction) {
	const { link, title, type, message, number } = req.locals.data as CreateLinkValidationResult;

	const id = req.locals.id;

	const service = new LinkShortenerService(req.locals.serviceAccount);

	let doc;
	if (type === 'whatsapp') {
		doc = await service.updateWhatsappLink(id, { title, phoneNumber: number!, message: message! });
	} else {
		doc = await service.updateShortenLink(id, { title, link });
	}

	return Respond({
		res,
		status: 200,
		data: {
			details: doc,
		},
	});
}

async function deleteLink(req: Request, res: Response, next: NextFunction) {
	const id = req.locals.id;

	const service = new LinkShortenerService(req.locals.serviceAccount);

	await service.deleteShortenLink(id);

	return Respond({
		res,
		status: 200,
	});
}

async function open(req: Request, res: Response, next: NextFunction) {
	const id = req.params.id;
	const doc = await LinkShortenerService.findShortenLink(id);
	if (!doc) {
		return res.send();
	}
	return res.redirect(doc.link);
}

async function listAll(req: Request, res: Response, next: NextFunction) {
	const service = new LinkShortenerService(req.locals.serviceAccount);

	return Respond({
		res,
		status: 200,
		data: {
			list: await service.getShortenLinks(),
		},
	});
}

const WhatsappShortener = {
	createLink,
	open,
	deleteLink,
	updateLink,
	listAll,
};

export default WhatsappShortener;
