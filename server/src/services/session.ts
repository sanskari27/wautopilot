import { randomBytes } from 'crypto';
import { AccountDB, SessionDB, StorageDB } from '../../mongo';
import { UserLevel } from '../config/const';
import { AUTH_ERRORS, CustomError, ERRORS } from '../errors';
import { IDType } from '../types';
import UserService from './user';

type SessionDetails = {
	ipAddress?: string;
	platform?: string;
	browser?: string;
	latitude?: number;
	longitude?: number;
};

export default class SessionService {
	static async findAccountById(id: IDType) {
		const history = await SessionDB.findById(id);
		if (!history) {
			throw new CustomError(ERRORS.NOT_FOUND);
		}

		const account = await AccountDB.findById(history.account);
		if (!account) {
			throw new CustomError(ERRORS.NOT_FOUND);
		}

		return new UserService(account);
	}

	static async findAccountByRefreshToken(token: string) {
		const history = await SessionDB.findOne({
			refreshToken: token,
		});
		if (!history) {
			throw new CustomError(ERRORS.NOT_FOUND);
		}

		const account = await AccountDB.findById(history.account);
		if (!account) {
			throw new CustomError(ERRORS.NOT_FOUND);
		}

		return new UserService(account);
	}

	static async login(
		email: string,
		password: string,
		opts: SessionDetails & { level: UserLevel } = { level: UserLevel.User }
	) {
		const user = await AccountDB.findOne({ email, userLevel: opts.level }).select('+password');
		if (user === null) {
			throw new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR);
		}

		const password_matched = await user.verifyPassword(password);
		if (!password_matched) {
			throw new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR);
		}

		const session = await SessionDB.create({
			account: user,
			ipAddress: opts.ipAddress || '',
			platform: opts.platform || '',
			browser: opts.browser || '',
			latitude: opts.latitude || 0,
			longitude: opts.longitude || 0,
		});

		return [
			{ authToken: session.getAuthToken(), refreshToken: session.getRefreshToken() },
			new UserService(user),
		] as [{ authToken: string; refreshToken: string }, UserService];
	}

	static async register(
		email: string,
		password: string,
		opts: SessionDetails & {
			name?: string;
			phone?: string;
			level: UserLevel;
		} = { level: UserLevel.User }
	) {
		try {
			const user = await AccountDB.create({
				email,
				password,
				name: opts.name,
				phone: opts.phone,
				userLevel: opts.level,
			});
			const session = await SessionDB.create({
				account: user,
				ipAddress: opts.ipAddress || '',
				platform: opts.platform || '',
				browser: opts.browser || '',
				latitude: opts.latitude || 0,
				longitude: opts.longitude || 0,
			});

			return [
				{ authToken: session.getAuthToken(), refreshToken: session.getRefreshToken() },
				new UserService(user),
			] as [{ authToken: string; refreshToken: string }, UserService];
		} catch (err) {
			throw new CustomError(AUTH_ERRORS.USER_ALREADY_EXISTS);
		}
	}

	static async listUser() {
		const accounts = await AccountDB.find();

		return accounts.map((acc) => ({
			name: acc.name,
			phone: acc.phone,
			email: acc.email,
		}));
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

		const session = await SessionDB.create({
			account: user,
		});

		return [
			{ authToken: session.getAuthToken(), refreshToken: session.getRefreshToken() },
			new UserService(user),
		] as [{ authToken: string; refreshToken: string }, UserService];
	}

	static async markLogout(token: string) {
		await SessionDB.deleteOne({
			refreshToken: token,
		});
	}
}
