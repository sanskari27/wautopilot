import { configureStore } from '@reduxjs/toolkit';

import { StoreNames } from './config';
import { default as CollectionsReducer } from './reducers/CollectionsReducer';

const store = configureStore({
	reducer: {
		[StoreNames.COLLECTIONS]: CollectionsReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export default store;

export type StoreState = ReturnType<typeof store.getState>;
