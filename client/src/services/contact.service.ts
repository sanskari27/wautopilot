/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/lib/api';
import { Contact } from '@/types/phonebook';

const formatContact = (contact: any) => {
	return {
		id: contact.id ?? '',
		formatted_name: contact.formatted_name ?? '',
		name: {
			formatted_name: contact.formatted_name ?? '',
			first_name: contact.name.first_name ?? '',
			last_name: contact.name.last_name ?? '',
			middle_name: contact.name.middle_name ?? '',
			suffix: contact.name.suffix ?? '',
			prefix: contact.name.prefix ?? '',
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
			company: contact.org.company ?? '',
			department: contact.org.department ?? '',
			title: contact.org.title ?? '',
		},
		birthday: contact.birthday ?? '',
	};
};

export default class ContactService {
	static async listContacts() {
		try {
			const { data } = await api.get(`/contacts`, {
				params: {
					page: 1,
					limit: 1000,
				},
			});
			return data.contacts.map(formatContact);
		} catch (error) {
			return [];
		}
	}

	static async addContact(contact: Omit<Contact, 'id' | 'formatted_name'>) {
		const { data } = await api.post(`/contacts`, contact);
		return formatContact(data.contact);
	}
	static async deleteContact(ids: string[]) {
		await api.delete(`/contacts`, { data: { ids } });
	}
	static async updateContact(contact: Omit<Contact, 'formatted_name'>) {
		const { data } = await api.put(`/contacts/${contact.id}`, contact);
		return formatContact(data.contact);
	}
	static async assignLabels(phone_number: string, labels: string[] = []) {
		await api.post(`/phonebook/set-labels/phone/${phone_number}`, {
			labels,
		});
	}
}
