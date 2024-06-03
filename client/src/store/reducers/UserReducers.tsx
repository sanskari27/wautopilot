import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StoreNames } from '../config';
import { UserState } from '../types/UserState';

const initialState: UserState = {
	isAuthenticated: false,
	isAuthenticating: false,
	email: '',
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
			state.isAuthenticating = initialState.isAuthenticating;
			state.password = initialState.password;
			state.confirmPassword = initialState.confirmPassword;
			state.error = initialState.error;
		},

		startUserAuthenticating(state) {
			state.isAuthenticating = true;
		},

		stopUserAuthenticating(state) {
			state.isAuthenticating = false;
		},

		setEmail: (state, action: PayloadAction<string>) => {
			state.error = initialState.error;
			state.email = action.payload;
		},

		setPassword: (state, action: PayloadAction<string>) => {
			state.error = initialState.error;
			state.password = action.payload;
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
} = UserSlice.actions;

export default UserSlice.reducer;
