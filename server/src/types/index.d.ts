/* eslint-disable no-var */

import { Types } from 'mongoose';
import IAccount from '../../mongo/types/account';
import IPlan from '../../mongo/types/plan';
import { UserService } from '../services';
import WhatsappLinkService from '../services/whatsappLink';

declare global {
	var __basedir: string;
	var __augmont_auth_token: string;

	namespace Express {
		interface Request {
			locals: LocalVariables;
		}
		interface Response {
			locals: LocalVariables;
		}
	}
}

export type IDType = Types.ObjectId;

export interface LocalVariables {
	query: any;
	data: any;
	id: IDType;
	account: IAccount;
	user: UserService;
	device: WhatsappLinkService;
	plan: IPlan;
}

export { default as ServerError } from './serverError';
