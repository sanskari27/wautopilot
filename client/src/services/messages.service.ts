/* eslint-disable @typescript-eslint/no-explicit-any */
import APIInstance from '../config/APIInstance';

export default class MessagesService {
	static async fetchAllConversation(deviceId: string) {
		try {
			const { data } = await APIInstance.get(`/message/${deviceId}/conversations`);
			return (
				data.conversations ??
				[].map((conversation: any) => {
					return {
						_id: conversation._id ?? '',
						recipient: conversation.recipient ?? '',
						profile_name: conversation.profile_name ?? '',
						origin: conversation.origin ?? '',
						expiration_timestamp: conversation.expiration_timestamp ?? '',
					};
				})
			);
		} catch (err) {
			return [];
		}
	}

	static async fetchConversationMessages(deviceId: string, recipientId: string) {
		try {
			const { data } = await APIInstance.get(
				`/message/${deviceId}/conversations/${recipientId}/messages`
			);
			return data.messages.map((message: any) => {
				return {
					_id: message._id ?? '',
					status: message.status ?? '',
					recipient: message.recipient ?? '',
					received_at: message.received_at ?? '',
					delivered_at: message.delivered_at ?? '',
					read_at: message.read_at ?? '',
					sent_at: message.sent_at ?? '',
					seen_at: message.seen_at ?? '',
					message_id: message.message_id ?? '',
					failed_at: message.failed_at ?? '',
					failed_reason: message.failed_reason ?? '',

					// header_type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
					// header_content_source: 'LINK' | 'MEDIA_ID' | 'TEXT';
					// header_content: string;
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
							latitude: message.body.location?.latitude ?? '',
							longitude: message.body.location?.longitude ?? '',
							name: message.body.location?.name ?? '',
							address: message.body.location?.address ?? '',
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
				};
			});
		} catch (err) {
			console.log(err);
			return [];
		}
	}
	static async getMedia(deviceId: string, mediaId: string) {
		try {
			const { data } = await APIInstance.get(`/uploads/${deviceId}/meta-media-url/${mediaId}`);
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
}
