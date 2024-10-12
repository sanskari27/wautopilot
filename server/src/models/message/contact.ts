import Message from './message';

export type MediaType = 'audio' | 'document' | 'image' | 'video';

export interface Contact {
	addresses: Address[];
	birthday: string;
	emails: Email[];
	name: Name;
	org: Org;
	phones: Phone[];
	urls: URL[];
}

export interface Address {
	city: string;
	country: string;
	country_code: string;
	state: string;
	street: string;
	type?: string;
	zip: string;
}

export interface Email {
	email: string;
	type?: string;
}

export interface Name {
	formatted_name: string;
	first_name: string;
	last_name: string;
	middle_name: string;
	suffix: string;
	prefix: string;
}

export interface Org {
	company: string;
	department: string;
	title: string;
}

export interface Phone {
	phone: string;
	type?: string;
	wa_id?: string;
}

export interface URL {
	url: string;
	type?: string;
}

export default class ContactMessage extends Message {
	private addresses?: Address[];
	private emails?: Email[];
	private name: Name;
	private birthday?: string;
	private org?: Org;
	private phones?: Phone[];
	private urls?: URL[];

	constructor(recipient: string, details?: Partial<Contact>) {
		super(recipient);
		this.name = {
			formatted_name:
				details?.name?.formatted_name ||
				(details?.name?.first_name || '') + ' ' + (details?.name?.last_name || ''),
			first_name: details?.name?.first_name || '',
			last_name: details?.name?.last_name || '',
			middle_name: details?.name?.middle_name || '',
			suffix: details?.name?.suffix || '',
			prefix: details?.name?.prefix || '',
		};

		this.birthday = details?.birthday || '';

		this.org = {
			company: details?.org?.company || '',
			department: details?.org?.department || '',
			title: details?.org?.title || '',
		};

		this.addresses = (details?.addresses || []).map((address) => ({
			city: address.city,
			country: address.country,
			country_code: address.country_code,
			state: address.state,
			street: address.street,
			type: address.type || 'HOME',
			zip: address.zip,
		}));

		this.emails = (details?.emails || []).map((email) => ({
			email: email.email,
			type: email.type || 'HOME',
		}));

		this.phones = (details?.phones || []).map((phone) => ({
			phone: phone.phone,
			type: phone.type || 'HOME',
			wa_id: phone.wa_id || phone.phone,
		}));

		this.urls = (details?.urls || []).map((url) => ({
			url: url.url,
			type: url.type || 'HOME',
		}));
	}

	setAddresses(addresses: Address[]) {
		this.addresses = addresses.map((address) => ({
			city: address.city,
			country: address.country,
			country_code: address.country_code,
			state: address.state,
			street: address.street,
			type: address.type || 'HOME',
			zip: address.zip,
		}));
		return this;
	}

	setEmails(emails: Email[]) {
		this.emails = emails.map((email) => ({
			email: email.email,
			type: email.type || 'HOME',
		}));
		return this;
	}

	setPhones(phones: Phone[]) {
		this.phones = phones.map((phone) => ({
			phone: phone.phone,
			type: phone.type || 'HOME',
			wa_id: phone.wa_id || phone.phone,
		}));
		return this;
	}

	setUrls(urls: URL[]) {
		this.urls = urls.map((url) => ({
			url: url.url,
			type: url.type || 'HOME',
		}));
		return this;
	}

	setBirthday(birthday: string) {
		this.birthday = birthday;
		return this;
	}

	setOrg(org: Org) {
		this.org = {
			company: org.company,
			department: org.department,
			title: org.title,
		};
		return this;
	}

	setName(name: Name) {
		this.name = {
			formatted_name: name.formatted_name,
			first_name: name.first_name,
			last_name: name.last_name,
			middle_name: name.middle_name,
			suffix: name.suffix,
			prefix: name.prefix,
		};
		return this;
	}

	toObject() {
		return {
			to: this.recipient,
			type: 'contacts',
			contacts: [
				{
					name: this.name,
					birthday: this.birthday,
					org: this.org,
					addresses: this.addresses,
					emails: this.emails,
					phones: this.phones,
					urls: this.urls,
				},
			],
			context: this.context,
		};
	}
}
