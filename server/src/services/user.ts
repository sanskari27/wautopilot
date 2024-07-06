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
import { Permissions, UserLevel } from '../config/const';
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
				permissions: {
					assigned_labels: user.permissions.assigned_labels ?? [],
					view_broadcast_reports: user.permissions.view_broadcast_reports ?? false,
					create_broadcast: user.permissions.create_broadcast ?? false,
					create_recurring_broadcast: user.permissions.create_recurring_broadcast ?? false,
					create_phonebook: user.permissions.create_phonebook ?? false,
					update_phonebook: user.permissions.update_phonebook ?? false,
					delete_phonebook: user.permissions.delete_phonebook ?? false,
					auto_assign_chats: user.permissions.auto_assign_chats ?? false,
					create_template: user.permissions.create_template ?? false,
					update_template: user.permissions.update_template ?? false,
					delete_template: user.permissions.delete_template ?? false,
					manage_media: user.permissions.manage_media ?? false,
					manage_contacts: user.permissions.manage_contacts ?? false,
					manage_chatbot: user.permissions.manage_chatbot ?? false,
					manage_chatbot_flows: user.permissions.manage_chatbot_flows ?? false,
				},
			};
		});
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
			view_broadcast_reports?: boolean;
			create_broadcast?: boolean;
			create_recurring_broadcast?: boolean;
			create_phonebook?: boolean;
			update_phonebook?: boolean;
			delete_phonebook?: boolean;
			auto_assign_chats?: boolean;
			create_template?: boolean;
			update_template?: boolean;
			delete_template?: boolean;
			manage_media?: boolean;
			manage_contacts?: boolean;
			manage_chatbot?: boolean;
			manage_chatbot_flows?: boolean;
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
			permissions: {
				assigned_labels: user.permissions.assigned_labels ?? [],
				view_broadcast_reports: user.permissions.view_broadcast_reports ?? false,
				create_broadcast: user.permissions.create_broadcast ?? false,
				create_recurring_broadcast: user.permissions.create_recurring_broadcast ?? false,
				create_phonebook: user.permissions.create_phonebook ?? false,
				update_phonebook: user.permissions.update_phonebook ?? false,
				delete_phonebook: user.permissions.delete_phonebook ?? false,
				auto_assign_chats: user.permissions.auto_assign_chats ?? false,
				create_template: user.permissions.create_template ?? false,
				update_template: user.permissions.update_template ?? false,
				delete_template: user.permissions.delete_template ?? false,
				manage_media: user.permissions.manage_media ?? false,
				manage_contacts: user.permissions.manage_contacts ?? false,
				manage_chatbot: user.permissions.manage_chatbot ?? false,
				manage_chatbot_flows: user.permissions.manage_chatbot_flows ?? false,
			},
		};
	}

	async getPermissions(): Promise<
		{
			assigned_labels: string[];
		} & {
			[key in Permissions]: boolean;
		}
	> {
		const permission = await PermissionDB.findOne({
			linked_to: this._user_id,
		});

		return {
			assigned_labels: permission?.assigned_labels ?? [],
			view_broadcast_reports: permission?.view_broadcast_reports ?? false,
			create_broadcast: permission?.create_broadcast ?? false,
			create_recurring_broadcast: permission?.create_recurring_broadcast ?? false,
			create_phonebook: permission?.create_phonebook ?? false,
			update_phonebook: permission?.update_phonebook ?? false,
			delete_phonebook: permission?.delete_phonebook ?? false,
			auto_assign_chats: permission?.auto_assign_chats ?? false,
			create_template: permission?.create_template ?? false,
			update_template: permission?.update_template ?? false,
			delete_template: permission?.delete_template ?? false,
			manage_media: permission?.manage_media ?? false,
			manage_contacts: permission?.manage_contacts ?? false,
			manage_chatbot: permission?.manage_chatbot ?? false,
			manage_chatbot_flows: permission?.manage_chatbot_flows ?? false,
		};
	}
}
