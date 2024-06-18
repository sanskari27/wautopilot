export type CouponsState = {
	list: Coupon[];
	couponDetails: Coupon;
	uiDetails: {
		isSaving: boolean;
		isFetching: boolean;
		isDeleting: boolean;
		isCreating: boolean;
		isUpdating: boolean;
		error: string;
	};
};

type Coupon = {
	id: string;
	name: string;
	couponCode: string;
	availableCoupon: number;
	discountAmount: number;
	discountPercentage: number;
	discountType: 'amount' | 'percentage';
};
