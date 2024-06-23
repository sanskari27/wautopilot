import { randomBytes } from 'crypto';
import { Types } from 'mongoose';
import { AccountDB, PlanDB, SessionDB, StorageDB } from '../../mongo';
import IAccount from '../../mongo/types/account';
import { UserLevel } from '../config/const';
import { AUTH_ERRORS, CustomError, PAYMENT_ERRORS } from '../errors';
import COMMON_ERRORS from '../errors/common-errors';
import { sendLoginCredentialsEmail } from '../provider/email';
import { IDType } from '../types';
import DateUtils from '../utils/DateUtils';
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
	private _account: IAccount;

	public constructor(account: IAccount) {
		this._user_id = account._id;
		this._level = account.userLevel;
		this._account = account;
	}

	static async findById(id: IDType) {
		const account = await AccountDB.findById(id);
		if (!account) {
			throw new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR);
		}

		return new UserService(account);
	}

	static async login(email: string, password: string, opts: SessionDetails) {
		const user = await AccountDB.findOne({ email }).select('+password');
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

	static async loginById(id: Types.ObjectId) {
		const user = await AccountDB.findById(id);
		if (user === null) {
			throw new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR);
		}

		const session = await SessionService.createSession(user._id, {});

		return {
			authToken: session.authToken,
			refreshToken: session.refreshToken,
			userService: new UserService(user),
		};
	}

	getUser() {
		return this._account;
	}

	async getDetails() {
		const isSubscribed =
			this._account.subscription &&
			this._account.subscription.end_date &&
			DateUtils.getMoment(this._account.subscription.end_date).isAfter(DateUtils.getMomentNow());

		const subscription_expiry = this._account.subscription?.end_date
			? DateUtils.getMoment(this._account.subscription.end_date).format('YYYY-MM-DD')
			: '';

		let no_of_devices = 0;

		if (isSubscribed) {
			const plan = await PlanDB.findById(this._account.subscription!.plan_id);
			no_of_devices = plan?.no_of_devices ?? 0;
		}
		return {
			name: this._account.name,
			email: this._account.email,
			phone: this._account.phone,
			isSubscribed,
			subscription_expiry,
			walletBalance: this._account.walletBalance.toFixed(2),
			no_of_devices,
		};
	}

	static async register(
		email: string,
		opts: {
			name?: string;
			phone?: string;
			level: UserLevel;
		}
	) {
		try {
			const password = generateNewPassword();
			await AccountDB.create({
				email,
				password,
				name: opts.name,
				phone: opts.phone,
				userLevel: opts.level,
				subscription: {
					plan_id: '6671deb40994d39d3f22a34e',
					start_date: DateUtils.getMomentNow().toDate(),
					end_date: DateUtils.getMomentNow().add(7, 'days').toDate(),
				},
			});

			sendLoginCredentialsEmail(email, email, password);
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

	public get account() {
		return this._account;
	}

	public get walletBalance() {
		return this._account.walletBalance;
	}

	public get markupPrice() {
		return this._account.markupPrice;
	}

	public async setMarkupPrice(rate: number) {
		if (rate < 0) {
			throw new CustomError(COMMON_ERRORS.INVALID_FIELDS);
		}
		await AccountDB.updateOne(
			{
				_id: this._user_id,
			},
			{
				$set: {
					markupPrice: rate,
				},
			}
		);
	}

	public async addWalletBalance(amount: number) {
		if (amount < 0) {
			throw new CustomError(PAYMENT_ERRORS.INVALID_AMOUNT);
		}
		this._account.walletBalance += amount;
		await AccountDB.updateOne(
			{
				_id: this._user_id,
			},
			{
				$inc: {
					walletBalance: amount,
				},
			}
		);
	}

	public async deductCredit(numberOfMessages: number) {
		if (numberOfMessages <= 0) {
			return;
		}

		this._account.walletBalance -= this._account.markupPrice * numberOfMessages;
		await AccountDB.updateOne(
			{
				_id: this._user_id,
			},
			{
				$inc: {
					walletBalance: -1 * (this._account.markupPrice * numberOfMessages),
				},
			}
		);
	}

	public async extendSubscription(date: string) {
		const details = await this.getDetails();

		if (!details.isSubscribed) {
			throw new CustomError(PAYMENT_ERRORS.NOT_SUBSCRIBED);
		}

		const _date = DateUtils.getMoment(date, 'YYYY-MM-DD').toDate();

		await AccountDB.updateOne(
			{
				_id: this._user_id,
			},
			{
				$set: {
					'subscription.end_date': _date,
				},
			}
		);
	}

	public async upgradePlan(plan_id: Types.ObjectId, date: string) {
		const plan = await PlanDB.findById(plan_id);
		if (!plan) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		const _date = DateUtils.getMoment(date, 'YYYY-MM-DD').toDate();

		await AccountDB.updateOne(
			{
				_id: this._user_id,
			},
			{
				$set: {
					'subscription.plan_id': plan_id,
					'subscription.end_date': _date,
				},
			}
		);
	}

	public async removePlan() {
		await AccountDB.updateOne(
			{
				_id: this._user_id,
			},
			{
				$set: {
					subscription: undefined,
				},
			}
		);
	}

	public async getUsers() {
		if (this._level !== UserLevel.Master) {
			throw new CustomError(AUTH_ERRORS.PERMISSION_DENIED);
		}

		const users = await AccountDB.find({
			userLevel: {
				$gte: UserLevel.Admin,
			},
		});

		return users.map((user) => {
			return {
				id: user._id,
				name: user.name ?? '',
				email: user.email ?? '',
				phone: user.phone ?? '',
				isSubscribed:
					user.subscription &&
					DateUtils.getMoment(user.subscription.end_date).isAfter(DateUtils.getMomentNow()),
				plan_id: user.subscription?.plan_id ?? '',
				markup: user.markupPrice ?? 0,
				subscription_expiry: user.subscription?.end_date ?? '',
			};
		});
	}
}
