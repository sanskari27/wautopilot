import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StoreNames } from '../config';
import { Product, ProductsState } from '../types/ProductsState';

const initialState: ProductsState = {
	list: [] as Product[],
	customizations: [],
	productDetails: {
		id: '',
		productCode: '',
		name: '',
		description: '',
		details: '',
		pricing_bifurcation: '',
		images: [],
		videos: [],
		tags: [],
		size: '',
		metal_color: '',
		metal_type: '',
		metal_quality: '',
		diamond_type: '',
		price: 0,
		discount: 0,
		discontinued: false,
		listedOn: '',
	},
	uiDetails: {
		isSaving: false,
		isFetching: false,
		isDeleting: false,
		isCreating: false,
		isUpdating: false,
		error: '',
	},
	pricing_bifurcation: '',
	productGroups: [],
	selectedProductGroup: {
		id: '',
		name: '',
		productCodes: [],
	},
};

const Slice = createSlice({
	name: StoreNames.PRODUCTS,
	initialState,
	reducers: {
		reset: (state) => {
			state.productDetails = initialState.productDetails;
			state.uiDetails = initialState.uiDetails;
			state.pricing_bifurcation = initialState.pricing_bifurcation;
			state.selectedProductGroup = initialState.selectedProductGroup;
		},
		setProducts: (state, action: PayloadAction<typeof initialState.list>) => {
			state.list = action.payload;
		},
		setProductDetails: (state, action: PayloadAction<typeof initialState.productDetails>) => {
			state.productDetails = action.payload;
		},
		setCustomizations: (state, action: PayloadAction<typeof initialState.customizations>) => {
			state.customizations = action.payload;
		},
		setProductGroups: (state, action: PayloadAction<typeof initialState.productGroups>) => {
			state.productGroups = action.payload;
		},
		setSelectedProductGroup: (state, action: PayloadAction<string>) => {
			const index = state.productGroups.findIndex((el) => el.id === action.payload);
			if (index === -1) {
				return;
			}
			state.selectedProductGroup = state.productGroups[index];
		},
		setRecommendationName: (state, action: PayloadAction<string>) => {
			state.selectedProductGroup.name = action.payload;
		},
		addProductCodeToGroup: (state, action: PayloadAction<string>) => {
			state.selectedProductGroup.productCodes.push(action.payload);
		},
		removeProductCodeToGroup: (state, action: PayloadAction<string>) => {
			state.selectedProductGroup.productCodes = state.selectedProductGroup.productCodes.filter(
				(item) => item !== action.payload
			);
		},
		addRecommendationGroup: (
			state,
			action: PayloadAction<(typeof initialState.productGroups)[0]>
		) => {
			state.productGroups.push(action.payload);
		},
		updateRecommendationGroup: (
			state,
			action: PayloadAction<(typeof initialState.productGroups)[0]>
		) => {
			state.productGroups = state.productGroups.map((item) => {
				if (item.id === action.payload.id) {
					return action.payload;
				}
				return item;
			});
		},
		updateBestSeller: (
			state,
			action: PayloadAction<{ productCode: string; isBestSeller: boolean }>
		) => {
			state.list = state.list.map((e) => {
				if (e.productCode === action.payload.productCode) {
					return {
						...e,
						isBestSeller: action.payload.isBestSeller,
					};
				}
				return e;
			});
		},
		updateVisibility: (state, action: PayloadAction<{ id: string; visible: boolean }>) => {
			state.customizations = state.customizations.map((e) => {
				if (e.id === action.payload.id) {
					return {
						...e,
						discontinued: !action.payload.visible,
					};
				}
				return e;
			});
		},
		setPricingBifurcation: (state, action: PayloadAction<string>) => {
			state.pricing_bifurcation = action.payload;
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
	setCustomizations,
	setProducts,
	setCreating,
	setDeleting,
	setError,
	setFetching,
	setSaving,
	setUpdating,
	setProductDetails,
	setProductGroups,
	setPricingBifurcation,
	updateVisibility,
	setSelectedProductGroup,
	setRecommendationName,
	addProductCodeToGroup,
	removeProductCodeToGroup,
	addRecommendationGroup,
	updateRecommendationGroup,
	updateBestSeller,
} = Slice.actions;

export default Slice.reducer;
