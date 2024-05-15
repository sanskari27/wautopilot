
import { StoreNames } from '../config';
import { Coupon, CouponsState } from '../types/CouponState';

const initialState: CouponsState = {
	list: [] as Coupon[],
	couponDetails: {
		id: '',
		name: '',
		couponCode: '',
		availableCoupon: 0,
		discountAmount: 0,
		discountPercentage: 0,
		discountType: 'amount',
	},
	uiDetails: {
		isSaving: false,
		isFetching: false,
		isDeleting: false,
		isCreating: false,
		isUpdating: false,
		error: '',
	},
};

const Slice = createSlice({
	name: StoreNames.COUPONS,
	initialState,
	reducers: {
		reset: (state) => {
			state.couponDetails = initialState.couponDetails;
			state.uiDetails = initialState.uiDetails;
		},
		setCoupons: (state, action: PayloadAction<typeof initialState.list>) => {
			state.list = action.payload;
		},
		editSelected: (state, action: PayloadAction<string>) => {
			const index = state.list.findIndex((c) => c.id === action.payload);

			if (index === -1) {
				return;
			}

			state.couponDetails = state.list[index];
			state.uiDetails.isUpdating = true;
		},
		setName: (state, action: PayloadAction<string>) => {
			state.couponDetails.name = action.payload;
		},
		setCouponCode: (state, action: PayloadAction<string>) => {
			state.couponDetails.couponCode = action.payload;
		},
		setAvailableCoupon: (state, action: PayloadAction<number>) => {
			state.couponDetails.availableCoupon = action.payload;
		},
		setDiscountAmount: (state, action: PayloadAction<number>) => {
			state.couponDetails.discountAmount = action.payload;
		},
		setDiscountPercentage: (state, action: PayloadAction<number>) => {
			state.couponDetails.discountPercentage = action.payload;
		},
		setDiscountType: (state, action: PayloadAction<typeof state.couponDetails.discountType>) => {
			state.couponDetails.discountType = action.payload;
		},
		setSaving: (state, action: PayloadAction<boolean>) => {
			state.uiDetails.isSaving = action.payload;
		},
		setFetching: (state, action: PayloadAction<boolean>) => {
			state.uiDetails.isFetching = action.payload;
		},
		setDeleting: (state, action: PayloadAction<boolean>) => {
			state.uiDetails.isDeleting = action.payload;
		},
		setCreating: (state, action: PayloadAction<boolean>) => {
			state.uiDetails.isCreating = action.payload;
		},
		setUpdating: (state, action: PayloadAction<boolean>) => {
			state.uiDetails.isUpdating = action.payload;
		},
		setError: (state, action: PayloadAction<string>) => {
			state.uiDetails.error = action.payload;
		},
	},
});

export const {
	reset,
	editSelected,
	setCreating,
	setDeleting,
	setError,
	setFetching,
	setName,
	setSaving,
	setUpdating,
	setAvailableCoupon,
	setCouponCode,
	setCoupons,
	setDiscountAmount,
	setDiscountPercentage,
	setDiscountType,
} = Slice.actions;

export default Slice.reducer;
