import { ServerError } from '../types';

const PAYMENT_ERRORS = {
	NOT_PAID: {
		STATUS: 400,
		TITLE: 'NOT_PAID',
		MESSAGE: 'The transaction has not been paid.',
	},
	INVALID_AMOUNT: {
		STATUS: 400,
		TITLE: 'INVALID_AMOUNT',
		MESSAGE: 'Invalid amount.',
	},
	NOT_SUBSCRIBED: {
		STATUS: 400,
		TITLE: 'NOT_SUBSCRIBED',
		MESSAGE: 'User is not subscribed.',
	},
} satisfies {
	[error: string]: ServerError;
};

export default PAYMENT_ERRORS;
