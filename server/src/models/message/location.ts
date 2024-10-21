import Message from './message';

export default class LocationMessage extends Message {
	private location: {
		latitude: string;
		longitude: string;
	};

	private name?: string;
	private address?: string;

	constructor(recipient: string, details: { latitude: string; longitude: string }) {
		super(recipient);
		this.location = { latitude: details.latitude, longitude: details.longitude };
	}

	setName(name: string) {
		if (!name) {
			return this;
		}
		this.name = name;
		return this;
	}

	setAddress(address: string) {
		if (!address) {
			return this;
		}
		this.address = address;
		return this;
	}

	toObject() {
		return {
			to: this.recipient,
			type: 'location',
			messaging_product: 'whatsapp',
			location: {
				latitude: this.location.latitude,
				longitude: this.location.longitude,
				...(this.name && { name: this.name }),
				...(this.address && { address: this.address }),
			},
			context: this.context,
		};
	}
}
