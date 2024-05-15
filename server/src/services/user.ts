import IAccount from '../../mongo/types/account';
import { IDType } from '../types';

export default class UserService {
	private _user_id: IDType;
	private _level: number;

	public constructor(account: IAccount) {
		this._user_id = account._id;
		this._level = account.userLevel;
	}

	public get id(): IDType {
		return this._user_id;
	}
	public get level(): number {
		return this._level;
	}
}
