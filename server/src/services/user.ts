import { randomBytes } from 'crypto';
import { AccountDB, SessionDB, StorageDB } from '../../mongo';
import IAccount from '../../mongo/types/account';
import { UserLevel } from '../config/const';
import { AUTH_ERRORS, CustomError } from '../errors';
import { sendLoginCredentialsEmail } from '../provider/email';
import { IDType } from '../types';
import { generateNewPassword } from '../utils/ExpressUtils';
import SessionService from './session';

type SessionDetails = {
	ipAddress?: string;
	platform?: string;
	browser?: string;
	latitude?: number;
	longitude?: number;
};

export default class UserService {
	private _user_id: IDType;
	private _level: UserLevel;

	public constructor(account: IAccount) {
		this._user_id = account._id;
		this._level = account.userLevel;
	}

	static async findById(id: IDType) {
		const account = await AccountDB.findById(id);
		if (!account) {
			throw new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR);
		}

		return new UserService(account);
	}

	static async login(email: string, password: string, opts: SessionDetails & { level: UserLevel }) {
		const user = await AccountDB.findOne({ email, userLevel: opts.level }).select('+password');
		if (user === null) {
			throw new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR);
		}

		const password_matched = await user.verifyPassword(password);
		if (!password_matched) {
			throw new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR);
		}

		const session = await SessionService.createSession(user._id, opts);

		return {
			authToken: session.authToken,
			refreshToken: session.refreshToken,
			userService: new UserService(user),
		};
	}

	static async register(
		email: string,
		opts: SessionDetails & {
			name?: string;
			phone?: string;
			level: UserLevel;
		}
	) {
		try {
			const password = generateNewPassword();
			const user = await AccountDB.create({
				email,
				password,
				name: opts.name,
				phone: opts.phone,
				userLevel: opts.level,
			});

			const session = await SessionService.createSession(user._id, opts);
			sendLoginCredentialsEmail(email, email, password);
			return {
				authToken: session.authToken,
				refreshToken: session.refreshToken,
				userService: new UserService(user),
			};
		} catch (err) {
			throw new CustomError(AUTH_ERRORS.USER_ALREADY_EXISTS);
		}
	}

	static async generatePasswordResetLink(email: string) {
		const user = await AccountDB.findOne({ email }).select('+password');
		if (user === null) {
			throw new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR);
		}

		const token = randomBytes(16).toString('hex');

		await StorageDB.setString(token, user._id.toString());
		return token;
	}

	static async saveResetPassword(token: string, password: string) {
		const id = await StorageDB.getString(token);

		if (!id) {
			throw new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR);
		}

		const user = await AccountDB.findOne({ _id: id }).select('+password');
		if (user === null) {
			throw new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR);
		}

		user.password = password;
		await user.save();

		await StorageDB.deleteOne({
			key: token,
		});

		const session = await SessionService.createSession(user._id, {});

		return {
			authToken: session.authToken,
			refreshToken: session.refreshToken,
			userService: new UserService(user),
		};
	}

	static async markLogout(token: string) {
		await SessionDB.deleteOne({
			refreshToken: token,
		});
	}

	public get userLevel() {
		return this._level;
	}

	public get userId() {
		return this._user_id;
	}
}
