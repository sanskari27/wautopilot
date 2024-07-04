import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StoreNames } from '../config';
import { UserState } from '../types/UserState';

const initialState: UserState = {
	uiDetails: {
		isAuthenticated: false,
		isLoading: true,
		isAuthenticating: false,
		resettingPassword: false,
	},
	email: '',
	newEmail: '',
	name: '',
	phone: '',
	accessLevel: 20,
	password: '',
	newPassword: '',
	confirmPassword: '',
	error: {
		message: '',
		type: '',
	},
};

const Slice = createSlice({
	name: StoreNames.USER,
	initialState,
	reducers: {
		reset: (state) => {
			state.email = initialState.email;
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
		stopUserLoading(state) {
			state.uiDetails.isLoading = false;
		},
		startResettingPassword(state) {
			state.uiDetails.resettingPassword = true;
		},
		stopResettingPassword(state) {
			state.uiDetails.resettingPassword = false;
		},
		setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
			state.uiDetails.isAuthenticated = action.payload;
		},
		setEmail: (state, action: PayloadAction<string>) => {
			state.error = initialState.error;
			state.email = action.payload;
		},
		setNewEmail: (state, action: PayloadAction<string>) => {
			state.error = initialState.error;
			state.newEmail = action.payload;
		},
		setName: (state, action: PayloadAction<string>) => {
			state.error = initialState.error;
			state.name = action.payload;
		},
		setPassword: (state, action: PayloadAction<string>) => {
			state.error = initialState.error;
			state.password = action.payload;
		},
		setNewPassword: (state, action: PayloadAction<string>) => {
			state.error = initialState.error;
			state.newPassword = action.payload;
		},
		setPhone: (state, action: PayloadAction<string>) => {
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
	setNewEmail,
	setPassword,
	setError,
	startUserAuthenticating,
	stopUserAuthenticating,
	setIsAuthenticated,
	setName,
	setPhone,
	startResettingPassword,
	setNewPassword,
	stopResettingPassword,
	stopUserLoading,
} = Slice.actions;

export default Slice.reducer;
