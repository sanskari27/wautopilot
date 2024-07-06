import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StoreNames } from '../config';
import { DashboardState } from '../types/Dashboard';

const initState: DashboardState = {
	details: {
		conversations: [],
		health: '',
		mediaSize: 0,
		messages: [],
		pendingToday: 0,
		phoneRecords: 0,
	},
	ui: {
		isLoading: true,
	},
};

const Slice = createSlice({
	name: StoreNames.DASHBOARD,
	initialState: initState,
	reducers: {
		setDashboardList: (state, action: PayloadAction<typeof initState.details>) => {
			state.ui.isLoading = false;
			state.details = action.payload;
			state.details.messages.sort((a, b) => {
				if (a.month > b.month) return 1;
				else if (a.month < b.month) return -1;
				else return a.day - b.day;
			});
			state.details.conversations.sort((a, b) => {
				if (a.year > b.year) return 1;
				else if (a.year < b.year) return -1;
				else return a.month - b.month;
			});
		},
	},
});

export const { setDashboardList } = Slice.actions;

export default Slice.reducer;
