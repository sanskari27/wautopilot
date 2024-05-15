import ServerError from '../config/ServerError';
import IServerError from '../types/serverError';

export default class CustomError extends ServerError {
	title: string;
	message: string;
	status: number;
	error: any;
	constructor(option: IServerError, err: any = null) {
		super(option.MESSAGE);
		Object.setPrototypeOf(this, CustomError.prototype);
		this.title = option.TITLE;
		this.message = option.MESSAGE;
		this.status = option.STATUS;
		this.error = err;
	}

	serializeError() {
		return {
			title: this.title,
			message: this.message,
			status: this.status,
		};
	}

	toString() {
		return 'Error: ' + this.status + ' - ' + this.title + ' - ' + this.message + '\n';
	}
}
