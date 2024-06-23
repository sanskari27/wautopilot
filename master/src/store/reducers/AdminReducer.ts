import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StoreNames } from '../config';
import { AdminState } from '../types/AdminState';

const initialState: AdminState = {
	admins: [],
	loading: true,
	error: '',
};

const Slice = createSlice({
	name: StoreNames.ADMIN,
	initialState,
	reducers: {
		listAdmins(state, action: PayloadAction<typeof initialState.admins>) {
			state.admins = action.payload;
		},
		setAdminLoading(state, action: PayloadAction<boolean>) {
			state.loading = action.payload;
		},
		setAdminExpiry(state, action: PayloadAction<{ id: string; date: string }>) {
			state.admins.map((admin) => {
				if (admin.id === action.payload.id) {
					admin.subscription_expiry = action.payload.date;
				}
				return admin;
			});
		},
		setAdminMarkup(state, action: PayloadAction<{ id: string; rate: number }>) {
			state.admins.map((admin) => {
				if (admin.id === action.payload.id) {
					admin.markup = action.payload.rate;
				}
				return admin;
			});
		},
	},
});

export const { listAdmins, setAdminLoading, setAdminExpiry,setAdminMarkup } = Slice.actions;

export default Slice.reducer;
