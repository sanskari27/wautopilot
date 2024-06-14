import { configureStore } from '@reduxjs/toolkit';

import { StoreNames } from './config';
import { default as BroadcastReducer } from './reducers/BroadcastReducer';
import { default as MediaReducer } from './reducers/MediaReducer';
import DevicesReducers from './reducers/DevicesReducers';
import { default as PhonebookReducer } from './reducers/PhonebookReducer';
import { default as TemplateReducer } from './reducers/TemplateReducer';
import UserReducers from './reducers/UserReducers';
import RecipientReducer from './reducers/RecipientReducer';
import MessagesReducers from './reducers/MessagesReducers';

const store = configureStore({
	reducer: {
		[StoreNames.MEDIA]: MediaReducer,
		[StoreNames.BROADCAST]: BroadcastReducer,
		[StoreNames.TEMPLATES]: TemplateReducer,
		[StoreNames.PHONEBOOK]: PhonebookReducer,
		[StoreNames.USER]: UserReducers,
		[StoreNames.DEVICES]: DevicesReducers,
		[StoreNames.RECIPIENT]: RecipientReducer,
		[StoreNames.MESSAGES]: MessagesReducers,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export default store;

export type StoreState = ReturnType<typeof store.getState>;
