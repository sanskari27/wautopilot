/* eslint-disable @typescript-eslint/no-explicit-any */
import APIInstance from '../config/APIInstance';
import { Contact } from '../store/types/ContactState';

const formatContact = (contact: any) => {
	return {
		id: contact.id ?? '',
		name: {
			formatted_name: contact.formatted_name ?? '',
			first_name: contact.first_name ?? '',
			last_name: contact.last_name ?? '',
			middle_name: contact.middle_name ?? '',
			suffix: contact.suffix ?? '',
			prefix: contact.prefix ?? '',
		},
		phones:
			contact.phones ??
			[].map((phone: any) => {
				return {
					phone: phone.phone ?? '',
					wa_id: phone.wa_id ?? '',
					type: phone.type ?? '',
				};
			}),
		emails:
			contact.emails ??
			[].map((email: any) => {
				return {
					email: email.email ?? '',
					type: email.type ?? '',
				};
			}),
		urls:
			contact.urls ??
			[].map((url: any) => {
				return {
					url: url.url ?? '',
					type: url.type ?? '',
				};
			}),
		addresses:
			contact.addresses ??
			[].map((address: any) => {
				return {
					type: address.type ?? '',
					street: address.street ?? '',
					city: address.city ?? '',
					state: address.state ?? '',
					zip: address.zip ?? '',
					country: address.country ?? '',
					country_code: address.country_code ?? '',
				};
			}),
		org: {
			company: contact.company ?? '',
			department: contact.department ?? '',
			title: contact.title ?? '',
		},
		birthday: contact.birthday ?? '',
	};
};

export default class ContactService {
	static async getContacts() {
		try {
			const { data } = await APIInstance.get(`/contacts`);
			return formatContact(data.contacts);
		} catch (error) {
			//ignore
		}
	}
	static async addContact(contact: Omit<Contact, 'id'>) {
		try {
			const { data } = await APIInstance.post(`/contacts`, contact);
			return formatContact(data.contact);
		} catch (error) {
			//ignore
		}
	}
	static async deleteContact(id: string) {
		try {
			await APIInstance.delete(`/contacts/${id}`);
			return true;
		} catch (error) {
			return false;
		}
	}
	static async updateContact(contact: Contact) {
		try {
			const { data } = await APIInstance.put(`/contacts/${contact.id}`, contact);
			return formatContact(data.contact);
		} catch (error) {
			//ignore
		}
	}
}
