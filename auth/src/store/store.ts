import { configureStore } from '@reduxjs/toolkit';

import { StoreNames } from './config';
import UserReducers from './reducers/UserReducers';

const store = configureStore({
	reducer: {
		[StoreNames.USER]: UserReducers,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export default store;

export type StoreState = ReturnType<typeof store.getState>;
