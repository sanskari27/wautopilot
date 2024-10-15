export default abstract class Message {
	protected readonly recipient;
	protected context?: {
		id: string;
	};

	constructor(recipient: string) {
		this.recipient = recipient;
	}

	getRecipient(): string {
		return this.recipient;
	}

	setContextMessage(id: string) {
		this.context = {
			id,
		};
		return this;
	}

	abstract toObject(): any;
}
