import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StoreNames } from '../config';
import { UserState } from '../types/UserState';

const initialState: UserState = {
	isAuthenticated: false,
	uiDetails: {
		isAuthenticated: false,
		isAuthenticating: false,
		resettingPassword: false,
	},
	email: '',
	name: '',
	phone: '',
	accessLevel: 20,
	password: '',
	confirmPassword: '',
	error: {
		message: '',
		type: '',
	},
};

const UserSlice = createSlice({
	name: StoreNames.COLLECTIONS,
	initialState,
	reducers: {
		reset: (state) => {
			state.email = initialState.email;
			state.isAuthenticated = initialState.isAuthenticated;
			state.uiDetails = initialState.uiDetails;
			state.password = initialState.password;
			state.confirmPassword = initialState.confirmPassword;
			state.error = initialState.error;
			state.accessLevel = initialState.accessLevel;
			state.name = initialState.name;
			state.phone = initialState.phone;
		},

		startUserAuthenticating(state) {
			state.uiDetails.isAuthenticating = true;
		},
		stopUserAuthenticating(state) {
			state.uiDetails.isAuthenticating = false;
		},
		startResettingPassword(state) {
			state.uiDetails.resettingPassword = true;
		},
		stopResettingPassword(state) {
			state.uiDetails.resettingPassword = false;
		},
		setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
			state.isAuthenticated = action.payload;
		},
		setEmail: (state, action: PayloadAction<string>) => {
			state.error = initialState.error;
			state.email = action.payload;
		},
		setName: (state, action: PayloadAction<string>) => {
			state.error = initialState.error;
			state.name = action.payload;
		},
		setPassword: (state, action: PayloadAction<string>) => {
			state.error = initialState.error;
			state.password = action.payload;
		},
		setPhone:(state, action: PayloadAction<string>) => {
			state.error = initialState.error;
			state.phone = action.payload;
		},
		setConfirmPassword: (state, action: PayloadAction<string>) => {
			state.error = initialState.error;
			state.confirmPassword = action.payload;
		},
		setError: (state, action: PayloadAction<typeof initialState.error>) => {
			state.error = action.payload;
		},
	},
});

export const {
	reset,
	setConfirmPassword,
	setEmail,
	setPassword,
	setError,
	startUserAuthenticating,
	stopUserAuthenticating,
	setIsAuthenticated,
	setName,
	setPhone,
	startResettingPassword,
	stopResettingPassword,
} = UserSlice.actions;

export default UserSlice.reducer;
