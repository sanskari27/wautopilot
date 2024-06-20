import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StoreNames } from '../config';
import { CouponsState } from '../types/CouponState';

const initialState: CouponsState = {
	list: [],
	selectedCouponId: [],
	couponDetails: {
		id: '',
		couponCode: '',
		availableCoupon: 0,
		couponPerUser: 0,
		discountAmount: 0,
		discountPercentage: 0,
		discountType: 'amount',
		totalCoupons: 0,
	},
	uiDetails: {
		isSaving: false,
		isFetching: true,
		isDeleting: false,
		isCreating: false,
		isUpdating: false,
		error: {
			type: '',
			message: '',
		},
	},
};

const Slice = createSlice({
	name: StoreNames.COUPON,
	initialState,
	reducers: {
		setCouponList(state, action: PayloadAction<typeof initialState.list>) {
			state.list = action.payload;
		},
		addCouponToList(state, action: PayloadAction<typeof initialState.couponDetails>) {
			state.list.push(action.payload);
		},
		removeCouponFromList(state, action: PayloadAction<string>) {
			state.list = state.list.filter((coupon) => coupon.id !== action.payload);
		},
		updateCouponFromList(state, action: PayloadAction<typeof initialState.couponDetails>) {
			const index = state.list.findIndex((coupon) => coupon.id === action.payload.id);
			if (index !== -1) {
				state.list[index] = action.payload;
			}
		},
		setCouponFetching(state, action: PayloadAction<boolean>) {
			state.uiDetails.isFetching = action.payload;
		},
		addSelectedCouponId(state, action: PayloadAction<string>) {
			state.selectedCouponId.push(action.payload);
		},
		removeSelectedCouponId(state, action: PayloadAction<string>) {
			state.selectedCouponId = state.selectedCouponId.filter((id) => id !== action.payload);
		},
		setSelectedCoupon: (state, action: PayloadAction<typeof initialState.couponDetails>) => {
			state.couponDetails = action.payload;
		},
		setCouponCode: (state, action: PayloadAction<string>) => {
			state.couponDetails.couponCode = action.payload;
		},
		setAvailableCoupon: (state, action: PayloadAction<string>) => {
			state.couponDetails.availableCoupon = parseInt(action.payload);
		},
		setCouponPerUser: (state, action: PayloadAction<string>) => {
			state.couponDetails.couponPerUser = parseInt(action.payload);
		},
		setDiscountAmount: (state, action: PayloadAction<string>) => {
			state.couponDetails.discountAmount = parseInt(action.payload);
		},
		setDiscountPercentage: (state, action: PayloadAction<string>) => {
			state.couponDetails.discountPercentage = parseInt(action.payload);
		},
		setDiscountType: (state, action: PayloadAction<'amount' | 'percentage'>) => {
			state.couponDetails.discountType = action.payload;
		},
		setTotalCoupons: (state, action: PayloadAction<string>) => {
			state.couponDetails.totalCoupons = parseInt(action.payload);
		},
		setSaving: (state, action: PayloadAction<boolean>) => {
			state.uiDetails.isSaving = action.payload;
		},
		setError: (state, action: PayloadAction<typeof initialState.uiDetails.error>) => {
			state.uiDetails.error = action.payload;
		},
		setCouponSaving: (state, action: PayloadAction<boolean>) => {
			state.uiDetails.isSaving = action.payload;
		},
	},
});

export const {
	setCouponList,
	updateCouponFromList,
	setCouponFetching,
	addSelectedCouponId,
	setCouponSaving,
	removeSelectedCouponId,
	setSelectedCoupon,
	setAvailableCoupon,
	setCouponCode,
	setCouponPerUser,
	setDiscountAmount,
	setDiscountPercentage,
	setDiscountType,
	setTotalCoupons,
	setSaving,
	setError,
	addCouponToList,
	removeCouponFromList,
} = Slice.actions;

export default Slice.reducer;
