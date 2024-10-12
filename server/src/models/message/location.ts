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
		this.name = name;
		return this;
	}

	setAddress(address: string) {
		this.address = address;
		return this;
	}

	toObject() {
		return {
			to: this.recipient,
			type: 'location',
			location: {
				latitude: this.location.latitude,
				longitude: this.location.longitude,
				name: this.name,
				address: this.address,
			},
			context: this.context,
		};
	}
}
