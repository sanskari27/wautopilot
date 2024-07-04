import { configureStore } from '@reduxjs/toolkit';

import { StoreNames } from './config';
import AdminReducer from './reducers/AdminReducer';
import CouponReducer from './reducers/CouponReducer';
import FAQReducer from './reducers/FAQReducer';
import UserReducers from './reducers/UserReducers';
import TestimonialReducer from './reducers/TestimonialReducer';

const store = configureStore({
	reducer: {
		[StoreNames.USER]: UserReducers,
		[StoreNames.ADMIN]: AdminReducer,
		[StoreNames.COUPON]: CouponReducer,
		[StoreNames.FAQ]: FAQReducer,
		[StoreNames.TESTIMONIAL]: TestimonialReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export default store;

export type StoreState = ReturnType<typeof store.getState>;
