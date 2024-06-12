import { configureStore } from '@reduxjs/toolkit';

import { StoreNames } from './config';
import { default as BroadcastReducer } from './reducers/BroadcastReducer';
import DevicesReducers from './reducers/DevicesReducers';
import { default as PhonebookReducer } from './reducers/PhonebookReducer';
import { default as TemplateReducer } from './reducers/TemplateReducer';
import UserReducers from './reducers/UserReducers';

const store = configureStore({
	reducer: {
		[StoreNames.BROADCAST]: BroadcastReducer,
		[StoreNames.TEMPLATES]: TemplateReducer,
		[StoreNames.PHONEBOOK]: PhonebookReducer,
		[StoreNames.USER]: UserReducers,
		[StoreNames.DEVICES]: DevicesReducers,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export default store;

export type StoreState = ReturnType<typeof store.getState>;
