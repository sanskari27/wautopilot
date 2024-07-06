import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StoreNames } from '../config';
import { FilterState } from '../types/LabelFilterState';

const initialState: FilterState = {
	labels: [],
};

const Slice = createSlice({
	name: StoreNames.FILTER_LABELS,
	initialState,
	reducers: {
		addFilterLabels: (state, action: PayloadAction<string>) => {
			state.labels.push(action.payload);
		},
		removeFilterLabels: (state, action: PayloadAction<string>) => {
			state.labels = state.labels.filter((label) => label !== action.payload);
		},
		clearFilterLabels: (state) => {
			state.labels = [];
		},
	},
});

export const { addFilterLabels, removeFilterLabels, clearFilterLabels } = Slice.actions;

export default Slice.reducer;
