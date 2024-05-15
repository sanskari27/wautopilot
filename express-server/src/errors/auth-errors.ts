import { ServerError } from '../types';

const AUTH_ERRORS = {
	AUTHORIZATION_ERROR: {
		STATUS: 401,
		TITLE: 'AUTHORIZATION_ERROR',
		MESSAGE: 'The user is not authorized to perform this action.',
	},
	USER_NOT_FOUND_ERROR: {
		STATUS: 404,
		TITLE: 'USER_NOT_FOUND_ERROR',
		MESSAGE: 'The user was not found. Please try again later.',
	},
	SESSION_INVALIDATED: {
		STATUS: 404,
		TITLE: 'SESSION_INVALIDATED',
		MESSAGE: 'The session was invalidated. Please login again.',
	},
	USER_ALREADY_EXISTS: {
		STATUS: 400,
		TITLE: 'USER_ALREADY_EXISTS',
		MESSAGE: 'The user already exists with given email or phone.',
	},
} satisfies {
	[error: string]: ServerError;
};

export default AUTH_ERRORS;
