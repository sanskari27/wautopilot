import Message from './message';

export default class LocationRequestMessage extends Message {
	private body?: string;

	constructor(recipient: string) {
		super(recipient);
	}

	setBody(body: string) {
		if (!body) {
			return this;
		}
		this.body = body;
		return this;
	}

	toObject() {
		return {
			to: this.recipient,
			type: 'interactive',
			interactive: {
				type: 'location_request_message',
				body: {
					text: this.body,
				},
				action: {
					name: 'send_location',
				},
			},
			context: this.context,
		};
	}
}
