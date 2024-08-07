/* eslint-disable @typescript-eslint/no-explicit-any */
import APIInstance from '../config/APIInstance';
import { Contact } from '../store/types/ContactState';

export default class MessagesService {
	static async fetchAllConversation(deviceId: string, label_filter: string[] = []) {
		try {
			const { data } = await APIInstance.get(`/${deviceId}/conversation`, {
				params: {
					labels: label_filter.join(','),
				},
			});
			return (data.conversations ?? []).map((conversation: any) => {
				return {
					_id: conversation._id ?? '',
					recipient: conversation.recipient ?? '',
					profile_name: conversation.profile_name ?? '',
					origin: conversation.origin ?? '',
					expiration_timestamp: conversation.expiration_timestamp ?? '',
					labels: conversation.labels ?? [],
				};
			});
		} catch (err) {
			return [];
		}
	}

	static async fetchConversationMessages(
		deviceId: string,
		recipientId: string,
		pagination: {
			page: number;
			limit?: number;
			signal?: AbortSignal;
		}
	) {
		try {
			const { data } = await APIInstance.get(`/${deviceId}/conversation/${recipientId}/messages`, {
				params: {
					page: pagination.page,
					limit: pagination.limit || 50,
				},
				signal: pagination.signal,
			});
			return {
				messageLabels: data.labels ?? [],
				messages: data.messages.map((message: any) => {
					return {
						_id: message._id ?? '',
						status: message.status ?? '',
						labels: message.labels ?? [],
						recipient: message.recipient ?? '',
						received_at: message.received_at ?? '',
						delivered_at: message.delivered_at ?? '',
						read_at: message.read_at ?? '',
						sent_at: message.sent_at ?? '',
						seen_at: message.seen_at ?? '',
						message_id: message.message_id ?? '',
						failed_at: message.failed_at ?? '',
						failed_reason: message.failed_reason ?? '',

						header_type: message.header_type as 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT',
						header_content_source: message.header_content_source as 'LINK' | 'ID' | 'TEXT',
						header_content: message.header_content as string,
						body: {
							body_type: message.body.body_type ?? 'UNKNOWN',
							text: message.body.text ?? '',
							media_id: message.body.media_id ?? '',
							caption: message.body.caption ?? '',
							contacts: (message.body.contacts ?? []).map((contact: any) => {
								return {
									addresses: (contact.addresses ?? []).map((address: any) => {
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
									birthday: contact.birthday ?? '',
									emails: (contact.emails ?? []).map((email: any) => {
										return {
											email: email.email ?? '',
											type: email.type ?? '',
										};
									}),
									name: {
										formatted_name: contact.name?.formatted_name ?? '',
										first_name: contact.name?.first_name ?? '',
										last_name: contact.name?.last_name ?? '',
										middle_name: contact.name?.middle_name ?? '',
										suffix: contact.name?.suffix ?? '',
										prefix: contact.name?.prefix ?? '',
									},
									org: {
										company: contact.org?.company ?? '',
										department: contact.org?.department ?? '',
										title: contact.org?.title ?? '',
									},
									phones: (contact.phones ?? []).map((phone: any) => {
										return {
											phone: phone.phone ?? '',
											wa_id: phone.wa_id ?? '',
											type: phone.type ?? '',
										};
									}),
									urls: (contact.urls ?? []).map((url: any) => {
										return {
											url: url.url ?? '',
											type: url.type ?? '',
										};
									}),
								};
							}),
							location: {
								latitude: message.body?.location?.latitude ?? '',
								longitude: message.body?.location?.longitude ?? '',
								name: message.body?.location?.name ?? '',
								address: message.body?.location?.address ?? '',
							},
						},
						footer_content: message.footer_content ?? '',
						buttons: (message.buttons ?? []).map((button: any) => {
							return {
								button_type: button.button_type ?? 'URL',
								button_content: button.button_content ?? '',
							};
						}),
						context: {
							from: message.context?.from ?? '',
							id: message.context?.id ?? '',
						},
						sender: {
							id: message.sender?.id ?? '',
							name: message.sender?.name ?? '',
						},
					};
				}),
				expiry: data.expiry as number | 'EXPIRED',
			};
		} catch (err) {
			return {
				messageLabels: [],
				messages: [],
				expiry: 'EXPIRED' as number | 'EXPIRED',
			};
		}
	}
	static async getMedia(deviceId: string, mediaId: string) {
		try {
			const { data } = await APIInstance.get(`/${deviceId}/uploads/meta-media-url/${mediaId}`);
			return {
				url: data.url ?? '',
				mime_type: data.mime_type ?? '',
				size: data.size ?? 0,
			};
		} catch (err) {
			return {
				url: '',
				mime_type: '',
				size: 0,
			};
		}
	}
	static async sendConversationMessage(
		deviceId: string,
		recipientId: string,
		message: {
			type: 'text' | 'image' | 'video' | 'document' | 'audio' | 'location' | 'contacts';
			text?: string;
			media_id?: string;
			location?: {
				latitude?: string;
				longitude?: string;
				name?: string;
				address?: string;
			};
			contacts?: Omit<Contact, 'id' | 'formatted_name'>[];
			context?: {
				message_id?: string;
			};
		}
	) {
		try {
			await APIInstance.post(`/${deviceId}/conversation/${recipientId}/send-message`, message);
			return true;
		} catch (err) {
			return false;
		}
	}

	static async setNote(deviceId: string, recipientId: string, note: string) {
		try {
			await APIInstance.post(`/${deviceId}/conversation/${recipientId}/note`, { note });
			return true;
		} catch (err) {
			return false;
		}
	}

	static async getNote(deviceId: string, recipientId: string) {
		try {
			const { data } = await APIInstance.get(`/${deviceId}/conversation/${recipientId}/note`);
			return data.note ?? '';
		} catch (err) {
			return '';
		}
	}

	static async ConversationLabels(phone_number: string, labels: string[]) {
		try {
			await APIInstance.post(`/phonebook/set-labels/phone/${phone_number}`, {
				labels,
			});
			return true;
		} catch (err) {
			return false;
		}
	}

	static async assignMessageLabels(deviceId: string, messageId: string, labels: string[]) {
		try {
			await APIInstance.post(`/${deviceId}/conversation/message/${messageId}/assign-labels`, {
				labels,
			});
			return true;
		} catch (err) {
			return false;
		}
	}
	static async markRead(deviceId: string, message_id: string) {
		try {
			await APIInstance.post(`/${deviceId}/mark-read/${message_id}`);
			return true;
		} catch (err) {
			return false;
		}
	}

	static async fetchQuickReplies() {
		try {
			const { data } = await APIInstance.get('/users/quick-replies');
			return (data.quickReplies ?? []).map((reply: any) => {
				return {
					id: reply.id,
					message: reply.message,
				};
			});
		} catch (err) {
			return [];
		}
	}

	static async addQuickReply(message: string) {
		const { data } = await APIInstance.post('/users/quick-replies', {
			message,
		});
		return {
			id: data.id,
			message: data.message,
		};
	}

	static async editQuickReply({ id, message }: { id: string; message: string }) {
		const { data } = await APIInstance.put(`/users/quick-replies/${id}`, {
			message,
		});
		return {
			id: data.id,
			message: data.message,
		};
	}

	static async deleteQuickReply(id: string) {
		await APIInstance.delete(`/users/quick-replies/${id}`);
	}
}
