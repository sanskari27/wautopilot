import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../../errors';
import COMMON_ERRORS from '../../errors/common-errors';
import ContactService from '../../services/contacts';
import { Respond } from '../../utils/ExpressUtils';
import { CreateContactValidationResult, MultiDeleteValidationResult } from './contacts.validator';

async function getContacts(req: Request, res: Response, next: NextFunction) {
	const page = req.query.page ? parseInt(req.query.page as string) : 1;
	const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
	try {
		const contactService = new ContactService(req.locals.account);
		const contacts = await contactService.fetchContacts({
			page,
			limit,
		});

		const totalRecords = await contactService.totalRecords();

		return Respond({
			res,
			status: 200,
			data: {
				contacts,
				totalRecords,
			},
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function createContact(req: Request, res: Response, next: NextFunction) {
	try {
		const contactService = new ContactService(req.locals.account);
		const contact = await contactService.addContact(
			req.locals.data as CreateContactValidationResult
		);

		return Respond({
			res,
			status: 200,
			data: {
				contact,
			},
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR));
	}
}

async function updateContact(req: Request, res: Response, next: NextFunction) {
	try {
		const contactService = new ContactService(req.locals.account);
		const contact = await contactService.updateContact(
			req.locals.id,
			req.locals.data as CreateContactValidationResult
		);

		return Respond({
			res,
			status: 200,
			data: {
				contact,
			},
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function deleteContact(req: Request, res: Response, next: NextFunction) {
	try {
		const { ids } = req.locals.data as MultiDeleteValidationResult;
		const contactService = new ContactService(req.locals.account);
		await contactService.deleteContacts(ids);

		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

const Controller = {
	createContact,
	getContacts,
	updateContact,
	deleteContact,
};

export default Controller;
