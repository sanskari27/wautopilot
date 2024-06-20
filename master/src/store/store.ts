import { configureStore } from '@reduxjs/toolkit';

import { StoreNames } from './config';
import AdminReducer from './reducers/AdminReducer';
import { default as BroadcastReducer } from './reducers/BroadcastReducer';
import ContactReducer from './reducers/ContactReducer';
import CouponReducer from './reducers/CouponReducer';
import DevicesReducers from './reducers/DevicesReducers';
import { default as MediaReducer } from './reducers/MediaReducer';
import MessagesReducers from './reducers/MessagesReducers';
import { default as PhonebookReducer } from './reducers/PhonebookReducer';
import RecipientReducer from './reducers/RecipientReducer';
import { default as TemplateReducer } from './reducers/TemplateReducer';
import UserReducers from './reducers/UserReducers';

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
		[StoreNames.CONTACT]: ContactReducer,
		[StoreNames.ADMIN]: AdminReducer,
		[StoreNames.COUPON]: CouponReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export default store;

export type StoreState = ReturnType<typeof store.getState>;
