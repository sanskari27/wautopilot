import PhonePeProviderAPI from './api';
import { transactionCallback } from './callbacks';

const PhonePeProvider = {
	...PhonePeProviderAPI,
	Callbacks: {
		transactionCallback,
	},
};

export default PhonePeProvider;
