import { ServerError } from '../types';

const COMMON_ERRORS = {
	INTERNAL_SERVER_ERROR: {
		STATUS: 500,
		TITLE: 'INTERNAL_SERVER_ERROR',
		MESSAGE: 'There was an error while processing your request. Please try again later.',
	},
	INVALID_FIELDS: {
		STATUS: 400,
		TITLE: 'INVALID_FIELDS',
		MESSAGE: 'The request contains invalid fields. Please try again later.',
	},
	NOT_FOUND: {
		STATUS: 404,
		TITLE: 'NOT_FOUND',
		MESSAGE: 'The requested resource was not found. Please try again later.',
	},
	FILE_UPLOAD_ERROR: {
		STATUS: 500,
		TITLE: 'FILE_UPLOAD_ERROR',
		MESSAGE: 'There was an error while uploading the file. Please try again later.',
	},
	ALREADY_EXISTS: {
		STATUS: 400,
		TITLE: 'ALREADY_EXISTS',
		MESSAGE: 'The requested resource already exists. Please try again later.',
	},
	ERROR_PARSING_CSV: {
		STATUS: 500,
		TITLE: 'ERROR_PARSING_CSV',
		MESSAGE: 'There was an error while parsing the CSV file. Please try again later.',
	},
	PERMISSION_DENIED: {
		STATUS: 400,
		TITLE: 'PERMISSION_DENIED',
		MESSAGE: 'You do not have permission to access this resource.',
	},
} satisfies {
	[error: string]: ServerError;
};

export default COMMON_ERRORS;
