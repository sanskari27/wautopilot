import { NextFunction, Request, Response } from 'express';
import { CustomError, ERRORS } from '../../errors';
import ApiKeyService from '../../services/apiKeys';
import { Respond } from '../../utils/ExpressUtils';
import { TCreateAPIKey } from './keys.validator';

async function createAPIKey(req: Request, res: Response, next: NextFunction) {
	const { data, serviceAccount } = req.locals;
	const { name, device, permissions } = data as TCreateAPIKey;

	const apiKeyService = new ApiKeyService(serviceAccount);

	try {
		const doc = await apiKeyService.createAPIKey({ name, device, permissions });
		return Respond({
			res,
			status: 201,
			data: doc,
		});
	} catch (error) {
		next(new CustomError(ERRORS.INTERNAL_SERVER_ERROR));
	}
}

async function listKeys(req: Request, res: Response, next: NextFunction) {
	const { serviceAccount } = req.locals;

	const apiKeyService = new ApiKeyService(serviceAccount);

	try {
		const docs = await apiKeyService.listAPIKeys();
		return Respond({
			res,
			status: 201,
			data: {
				list: docs,
			},
		});
	} catch (error) {
		next(new CustomError(ERRORS.INTERNAL_SERVER_ERROR));
	}
}

async function deleteAPIKey(req: Request, res: Response, next: NextFunction) {
	const { serviceAccount, id } = req.locals;

	const apiKeyService = new ApiKeyService(serviceAccount);

	try {
		await apiKeyService.deleteAPIKey(id);
		return Respond({
			res,
			status: 200,
		});
	} catch (error) {
		next(new CustomError(ERRORS.INTERNAL_SERVER_ERROR));
	}
}

async function regenerateToken(req: Request, res: Response, next: NextFunction) {
	const { serviceAccount, id } = req.locals;

	const apiKeyService = new ApiKeyService(serviceAccount);

	try {
		const token = await apiKeyService.regenerateAPIKey(id);
		return Respond({
			res,
			status: 200,
			data: { token },
		});
	} catch (error) {
		next(new CustomError(ERRORS.INTERNAL_SERVER_ERROR));
	}
}

const Controller = {
	createAPIKey,
	listKeys,
	deleteAPIKey,
	regenerateToken,
};

export default Controller;
