import { randomBytes } from 'crypto';
import { Types } from 'mongoose';
import {
	AccountDB,
	PermissionDB,
	PlanDB,
	SessionDB,
	StorageDB,
	SubscriptionDetailsDB,
} from '../../mongo';
import IAccount from '../../mongo/types/account';
import { UserLevel } from '../config/const';
import { AUTH_ERRORS, CustomError, PAYMENT_ERRORS } from '../errors';
import COMMON_ERRORS from '../errors/common-errors';
import { sendLoginCredentialsEmail } from '../provider/email';
import { IDType } from '../types';
import DateUtils from '../utils/DateUtils';
import { filterUndefinedKeys, idValidator } from '../utils/ExpressUtils';
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

	async updateDetails(opts: { name?: string; email?: string; phone?: string }) {
		const update: any = filterUndefinedKeys(opts);

		await AccountDB.updateOne(
			{
				_id: this._user_id,
			},
			update
		);
		return {
			name: update.name ?? this._account.name,
			email: update.email ?? this._account.email,
			phone: update.phone ?? this._account.phone,
		};
	}

	async getDetails() {
		const details = {
			name: this._account.name,
			email: this._account.email,
			phone: this._account.phone,
			isSubscribed: false,
			subscription_expiry: '',
			walletBalance: this._account.walletBalance ?? 0,
			no_of_devices: 0,
			plan_id: '',
		};
		if (this._level < UserLevel.Admin) {
			return details;
		}

		const subscription = (await SubscriptionDetailsDB.findOne({
			user: this._user_id,
		}))!;

		const isSubscribed =
			!!subscription.plan_id &&
			subscription.end_date &&
			DateUtils.getMoment(subscription.end_date).isAfter(DateUtils.getMomentNow());

		const subscription_expiry = subscription.end_date
			? DateUtils.getMoment(subscription.end_date).format('YYYY-MM-DD')
			: '';

		let no_of_devices = 0;

		if (isSubscribed) {
			const plan = await PlanDB.findById(subscription.plan_id);
			no_of_devices = plan?.no_of_devices ?? 0;
		}
		details.isSubscribed = isSubscribed;
		details.subscription_expiry = subscription_expiry;
		details.no_of_devices = no_of_devices;
		details.plan_id = subscription.plan_id?.toString() ?? '';

		return details;
	}

	public get walletBalance() {
		return this._account.walletBalance;
	}

	public get markupPrice() {
		return this._account.markupPrice;
	}

	static async register(
		email: string,
		password: string,
		opts: {
			name?: string;
			phone?: string;
			level: UserLevel;
			linked_to?: Types.ObjectId;
		}
	) {
		try {
			const user = await AccountDB.create({
				email,
				password,
				name: opts.name,
				phone: opts.phone,
				userLevel: opts.level,
				parent: opts.linked_to,
			});
			if (opts.level >= UserLevel.Admin) {
				SubscriptionDetailsDB.create({
					user,
					plan_id: idValidator('6671deb40994d39d3f22a34e')[1],
					start_date: DateUtils.toDate(),
					end_date: DateUtils.getMomentNow().add(7, 'days').toDate(),
				}).catch(() => {});
			} else {
				PermissionDB.create({
					linked_to: user._id,
				}).catch(() => {});
			}

			sendLoginCredentialsEmail(email, email, password);
			return user._id;
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

		await AccountDB.updateOne({ _id: this._user_id }, [
			{
				$set: {
					walletBalance: {
						$subtract: ['$walletBalance', { $multiply: ['$markupPrice', numberOfMessages] }],
					},
				},
			},
		]);
	}

	public async extendSubscription(date: string) {
		const details = await this.getDetails();

		if (!details.isSubscribed) {
			throw new CustomError(PAYMENT_ERRORS.NOT_SUBSCRIBED);
		}

		const _date = DateUtils.getMoment(date, 'YYYY-MM-DD').toDate();

		await SubscriptionDetailsDB.updateOne(
			{
				user: this._user_id,
			},
			{
				$set: {
					end_date: _date,
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

		await SubscriptionDetailsDB.updateOne(
			{
				user: this._user_id,
			},
			{
				$set: {
					plan_id: plan_id,
					end_date: _date,
				},
			}
		);
	}

	public async removePlan() {
		await SubscriptionDetailsDB.updateOne(
			{
				_id: this._user_id,
			},
			{
				$set: {
					plan_id: undefined,
				},
			}
		);
	}

	public async getUsers() {
		if (this._level !== UserLevel.Master) {
			throw new CustomError(AUTH_ERRORS.PERMISSION_DENIED);
		}

		const users = await AccountDB.aggregate([
			{
				$match: {
					userLevel: {
						$gte: UserLevel.Admin,
					},
				},
			},
			{
				$lookup: {
					from: SubscriptionDetailsDB.collection.name, // The name of the collection to join
					localField: '_id', // Field from the input documents
					foreignField: 'user', // Field from the documents of the "from" collection
					as: 'details', // The name of the new array field to add to the input documents
				},
			},
			{
				$unwind: {
					path: '$details', // Unwind the joined documents
					preserveNullAndEmptyArrays: true, // Include documents that do not have a match
				},
			},
		]);

		return users.map((user) => {
			const subscription = user.details;
			const isSubscribed =
				!!subscription.plan_id &&
				subscription.end_date &&
				DateUtils.getMoment(subscription.end_date).isAfter(DateUtils.getMomentNow());

			const subscription_expiry = subscription.end_date
				? DateUtils.getMoment(subscription.end_date).format('YYYY-MM-DD')
				: '';

			return {
				id: user._id,
				name: user.name ?? '',
				email: user.email ?? '',
				phone: user.phone ?? '',
				isSubscribed,
				plan_id: subscription.plan_id ?? '',
				markup: user.markupPrice ?? 0,
				subscription_expiry: subscription_expiry,
			};
		});
	}

	public async getAgents() {
		const users = await AccountDB.aggregate([
			{
				$match: {
					userLevel: UserLevel.Agent,
					parent: this._user_id,
				},
			},
			{
				$lookup: {
					from: PermissionDB.collection.name, // The name of the collection to join
					localField: '_id', // Field from the input documents
					foreignField: 'linked_to', // Field from the documents of the "from" collection
					as: 'permissions', // The name of the new array field to add to the input documents
				},
			},
			{
				$unwind: {
					path: '$permissions',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$addFields: {
					permissions: {
						$ifNull: ['$permissions', {}],
					},
				},
			},
		]);

		return users.map((user) => {
			return {
				id: user._id,
				name: user.name ?? '',
				email: user.email ?? '',
				phone: user.phone ?? '',
				permissions: processPermissions(user.permissions),
			};
		});
	}

	public async getAgent(id: Types.ObjectId) {
		const agent = await AccountDB.findOne({
			_id: id,
			parent: this._user_id,
		});

		if (!agent) {
			throw new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR);
		}

		return agent;
	}

	async updateAgentDetails(
		id: Types.ObjectId,
		opts: { name?: string; email?: string; phone?: string }
	) {
		const update: any = filterUndefinedKeys(opts);

		await AccountDB.updateOne(
			{
				_id: id,
				parent: this._user_id,
			},
			update
		);

		const user = await AccountDB.findOne({
			_id: id,
			parent: this._user_id,
		});

		if (!user) {
			throw new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR);
		}

		return {
			name: user.name ?? '',
			email: user.email ?? '',
			phone: user.phone ?? '',
		};
	}

	async updateAgentPassword(id: Types.ObjectId, password: string) {
		const user = await AccountDB.findOne({ _id: id }).select('+password');
		if (user === null) {
			throw new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR);
		}

		user.password = password;
		await user.save();
	}

	async removeAgent(id: Types.ObjectId) {
		await AccountDB.deleteOne({
			_id: id,
			parent: this._user_id,
		});
		await PermissionDB.deleteOne({
			linked_to: id,
		});
	}

	async assignPermissions(
		id: Types.ObjectId,
		opts: {
			assigned_labels?: string[];
			auto_assign_chats?: boolean;
			phonebook?: {
				create: boolean;
				update: boolean;
				delete: boolean;
				export: boolean;
			};
			chatbot?: {
				create: boolean;
				update: boolean;
				delete: boolean;
				export: boolean;
			};
			chatbot_flow?: {
				create: boolean;
				update: boolean;
				delete: boolean;
				export: boolean;
			};
			broadcast?: {
				create: boolean;
				update: boolean;
				report: boolean;
				export: boolean;
			};
			recurring?: {
				create: boolean;
				update: boolean;
				delete: boolean;
				export: boolean;
			};
			media?: {
				create: boolean;
				update: boolean;
				delete: boolean;
			};
			contacts?: {
				create: boolean;
				update: boolean;
				delete: boolean;
			};
			template?: {
				create: boolean;
				update: boolean;
				delete: boolean;
			};
			buttons?: {
				read: boolean;
				export: boolean;
			};
		}
	) {
		await PermissionDB.updateOne(
			{
				linked_to: id,
			},
			{ $set: filterUndefinedKeys(opts) }
		);

		const users = await AccountDB.aggregate([
			{
				$match: {
					userLevel: UserLevel.Agent,
					parent: this._user_id,
					_id: id,
				},
			},
			{
				$lookup: {
					from: PermissionDB.collection.name, // The name of the collection to join
					localField: '_id', // Field from the input documents
					foreignField: 'linked_to', // Field from the documents of the "from" collection
					as: 'permissions', // The name of the new array field to add to the input documents
				},
			},
			{
				$unwind: {
					path: '$permissions',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$addFields: {
					permissions: {
						$ifNull: ['$permissions', {}],
					},
				},
			},
		]);

		const user = users[0];

		return {
			id: user._id,
			name: user.name ?? '',
			email: user.email ?? '',
			phone: user.phone ?? '',
			permissions: processPermissions(user.permissions),
		};
	}

	async getPermissions() {
		const permission = await PermissionDB.findOne({
			linked_to: this._user_id,
		});

		return processPermissions(permission);
	}
}

function processPermissions(permissions: any) {
	return {
		assigned_labels: (permissions?.assigned_labels as string[]) ?? [],
		auto_assign_chats: (permissions?.auto_assign_chats as boolean) ?? false,
		phonebook: {
			create: (permissions?.phonebook?.create as boolean) ?? false,
			update: (permissions?.phonebook?.update as boolean) ?? false,
			delete: (permissions?.phonebook?.delete as boolean) ?? false,
			export: (permissions?.phonebook?.export as boolean) ?? false,
		},
		chatbot: {
			create: (permissions?.chatbot?.create as boolean) ?? false,
			update: (permissions?.chatbot?.update as boolean) ?? false,
			delete: (permissions?.chatbot?.delete as boolean) ?? false,
			export: (permissions?.chatbot?.export as boolean) ?? false,
		},
		chatbot_flow: {
			create: (permissions?.chatbot_flow?.create as boolean) ?? false,
			update: (permissions?.chatbot_flow?.update as boolean) ?? false,
			delete: (permissions?.chatbot_flow?.delete as boolean) ?? false,
			export: (permissions?.chatbot_flow?.export as boolean) ?? false,
		},
		broadcast: {
			create: (permissions?.broadcast?.create as boolean) ?? false,
			update: (permissions?.broadcast?.update as boolean) ?? false,
			report: (permissions?.broadcast?.report as boolean) ?? false,
			export: (permissions?.broadcast?.export as boolean) ?? false,
		},
		recurring: {
			create: (permissions?.recurring?.create as boolean) ?? false,
			update: (permissions?.recurring?.update as boolean) ?? false,
			delete: (permissions?.recurring?.delete as boolean) ?? false,
			export: (permissions?.recurring?.export as boolean) ?? false,
		},
		media: {
			create: (permissions?.media?.create as boolean) ?? false,
			update: (permissions?.media?.update as boolean) ?? false,
			delete: (permissions?.media?.delete as boolean) ?? false,
		},
		contacts: {
			create: (permissions?.contacts?.create as boolean) ?? false,
			update: (permissions?.contacts?.update as boolean) ?? false,
			delete: (permissions?.contacts?.delete as boolean) ?? false,
		},
		template: {
			create: (permissions?.template?.create as boolean) ?? false,
			update: (permissions?.template?.update as boolean) ?? false,
			delete: (permissions?.template?.delete as boolean) ?? false,
		},
		buttons: {
			read: (permissions?.buttons?.read as boolean) ?? false,
			export: (permissions?.buttons?.export as boolean) ?? false,
		},
	};
}
