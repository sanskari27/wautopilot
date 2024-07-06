import { configureStore } from '@reduxjs/toolkit';

import { StoreNames } from './config';
import AgentReducer from './reducers/AgentReducer';
import { default as BroadcastReducer } from './reducers/BroadcastReducer';
import ChatBotReducer from './reducers/ChatBotReducer';
import ChatbotFlowReducer from './reducers/ChatbotFlowReducer';
import ContactReducer from './reducers/ContactReducer';
import DashboardReducer from './reducers/DashboardReducer';
import DevicesReducers from './reducers/DevicesReducers';
import { default as MediaReducer } from './reducers/MediaReducer';
import { default as LinkShortenerReducer } from './reducers/LinkShortenerReducer';
import MessagesReducers from './reducers/MessagesReducers';
import { default as PhonebookReducer } from './reducers/PhonebookReducer';
import RecipientReducer from './reducers/RecipientReducer';
import RecurringReducer from './reducers/RecurringReducer';
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
		[StoreNames.CHATBOT]: ChatBotReducer,
		[StoreNames.DASHBOARD]: DashboardReducer,
		[StoreNames.CHATBOT_FLOW]: ChatbotFlowReducer,
		[StoreNames.RECURRING]: RecurringReducer,
		[StoreNames.AGENT]: AgentReducer,
		[StoreNames.LINK]: LinkShortenerReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export default store;

export type StoreState = ReturnType<typeof store.getState>;
