/* eslint-disable no-var */

import { Types } from 'mongoose';
import { UserService } from '../services';

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
	user: UserService;
}

export { default as ServerError } from './serverError';
