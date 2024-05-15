import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StoreNames } from '../config';
import { CollectionsState } from '../types/CollectionsState';

const initialState: CollectionsState = {
	text: '',
};

const Slice = createSlice({
	name: StoreNames.COLLECTIONS,
	initialState,
	reducers: {
		reset: (state) => {
			state.text = initialState.text;
		},

		setText: (state, action: PayloadAction<string>) => {
			state.text = action.payload;
		},
	},
});

export const { reset, setText } = Slice.actions;

export default Slice.reducer;
