import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StoreNames } from '../config';
import { DashboardState } from '../types/Dashboard';

const initState: DashboardState = {
	conversations: [],
	health: '',
	mediaSize: 0,
	messages: [],
	pendingToday: 0,
	phoneRecords: 0,
};

const Slice = createSlice({
	name: StoreNames.DASHBOARD,
	initialState: initState,
	reducers: {
		setDashboardList: (state, action: PayloadAction<typeof initState>) => {
			state.conversations = action.payload.conversations;
			state.health = action.payload.health;
			state.mediaSize = action.payload.mediaSize;
			state.messages = action.payload.messages;
			state.pendingToday = action.payload.pendingToday;
			state.phoneRecords = action.payload.phoneRecords;
		},
	},
});

export const { setDashboardList } = Slice.actions;

export default Slice.reducer;
