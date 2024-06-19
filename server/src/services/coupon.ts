import { Types } from 'mongoose';
import CouponDB from '../../mongo/repo/Coupon';
import IAccount from '../../mongo/types/account';
import ICoupon from '../../mongo/types/coupon';
import { UserLevel } from '../config/const';
import { CustomError } from '../errors';
import COMMON_ERRORS from '../errors/common-errors';
import UserService from './user';

function processDocs(docs: ICoupon[]) {
	return docs.map((doc) => ({
		id: doc._id,
		code: doc.code,
		total_coupons: doc.total_coupons,
		discount_type: doc.discount_type,
		discount_amount: doc.discount_amount,
		discount_percentage: doc.discount_percentage,
		count_per_user: doc.count_per_user,
		available_coupons: doc.available_coupons,
	}));
}

export default class CouponService extends UserService {
	public constructor(account: IAccount) {
		super(account);
		if (account.userLevel !== UserLevel.Master) {
			throw new CustomError(COMMON_ERRORS.PERMISSION_DENIED);
		}
	}

	async delete(id: Types.ObjectId) {
		await CouponDB.deleteMany({
			_id: id,
		});
	}

	async listCoupons() {
		const coupons = await CouponDB.find();
		return processDocs(coupons);
	}

	async getCouponByID(id: Types.ObjectId) {
		const doc = await CouponDB.findById(id);
		if (!doc) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}
		return processDocs([doc])[0];
	}

	async getCouponByCode(code: string) {
		const doc = await CouponDB.findOne({
			code,
		});
		if (!doc) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}
		return processDocs([doc])[0];
	}

	async addCoupon(details: {
		code: string;
		total_coupons: number;
		discount_type: string;
		discount_amount: number;
		discount_percentage: number;
		count_per_user: number;
	}) {
		const doc = await CouponDB.create({
			...details,
			available_coupons: details.total_coupons,
		});

		return processDocs([doc])[0];
	}

	async updateCoupon(
		id: Types.ObjectId,
		details: {
			code: string;
			total_coupons: number;
			discount_type: string;
			discount_amount: number;
			discount_percentage: number;
			count_per_user: number;
		}
	) {
		await CouponDB.updateOne(
			{
				_id: id,
			},
			{
				...details,
				available_coupons: details.total_coupons,
			}
		);

		const doc = await CouponDB.findById(id);

		if (!doc) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		return processDocs([doc])[0];
	}
}
