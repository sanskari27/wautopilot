import Message from './message';

export default class TextMessage extends Message {
	private message: string;

	constructor(recipient: string, message: string) {
		super(recipient);
		this.message = message;
	}

	setMessage(message: string) {
		this.message = message;
		return this;
	}

	toObject() {
		return {
			to: this.recipient,
			type: 'text',
			text: {
				preview_url: false,
				body: this.message,
			},
		};
	}
}