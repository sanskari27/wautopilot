import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StoreNames } from '../config';
import { FAQState } from '../types/FAQState';

const initialState: FAQState = {
	list: [],
	details: {
		title: '',
		info: '',
	},
	ui: {
		isLoading: true,
		isEditing: false,
		isAdding: false,
	},
};

const Slice = createSlice({
	name: StoreNames.FAQ,
	initialState,
	reducers: {
		setFAQList: (state, action: PayloadAction<typeof initialState.list>) => {
			state.list = action.payload;
		},
		setTitle: (state, action: PayloadAction<string>) => {
			state.details.title = action.payload;
		},
		setInfo: (state, action: PayloadAction<string>) => {
			state.details.info = action.payload;
		},
		setFAQLoading: (state, action: PayloadAction<boolean>) => {
			state.ui.isLoading = action.payload;
		},
		setFAQDetails: (state, action: PayloadAction<typeof initialState.details>) => {
			state.details = action.payload;
		},
		setFAQEditing: (state, action: PayloadAction<boolean>) => {
			state.ui.isEditing = action.payload;
		},
		setFAQAdding: (state, action: PayloadAction<boolean>) => {
			state.ui.isAdding = action.payload;
		},
	},
});

export const {
	setFAQList,
	setInfo,
	setTitle,
	setFAQAdding,
	setFAQDetails,
	setFAQEditing,
	setFAQLoading,
} = Slice.actions;

export default Slice.reducer;
