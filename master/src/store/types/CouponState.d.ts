export type CouponsState = {
	list: Coupon[];
	couponDetails: Coupon;
	uiDetails: {
		isSaving: boolean;
		isFetching: boolean;
		isDeleting: boolean;
		isCreating: boolean;
		isUpdating: boolean;
		error: {
			type:
				| 'COUPON_CODE'
				| 'AVAILABLE_COUPON'
				| 'COUPON_PER_USER'
				| 'DISCOUNT_AMOUNT'
				| 'DISCOUNT_PERCENTAGE'
				| 'DISCOUNT_TYPE'
				| 'TOTAL_COUPONS'
				| '';
			message: string;
		};
	};
	selectedCouponId: string[];
};

type Coupon = {
	id: string;
	couponCode: string;
	availableCoupon: number;
	couponPerUser: number;
	discountAmount: number;
	discountPercentage: number;
	discountType: 'amount' | 'percentage';
	totalCoupons: number;
};
