import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StoreNames } from '../config';
import { DevicesState } from '../types/DevicesState';

const initialState: DevicesState = {
	list: [],
	uiDetails: {
		loadingDevices: false,
	},
};

const Slice = createSlice({
	name: StoreNames.DEVICES,
	initialState,
	reducers: {
		setDevicesList: (state, action: PayloadAction<DevicesState['list']>) => {
			state.list = action.payload;
		},
		startDeviceLoading: (state) => {
			state.uiDetails.loadingDevices = true;
		},
		stopDeviceLoading: (state) => {
			state.uiDetails.loadingDevices = false;
		},
	},
});

export const { setDevicesList, startDeviceLoading, stopDeviceLoading } = Slice.actions;

export default Slice.reducer;
