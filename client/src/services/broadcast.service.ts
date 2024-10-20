import { Contact } from '@/schema/phonebook';
import api from '../lib/api';

export default class BroadcastService {
	static async fetchAllConversation(deviceId: string, label_filter: string[] = []) {
		try {
			const { data } = await api.get(`/${deviceId}/broadcast/conversations`, {
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
		}
	) {
		try {
			const { data } = await api.get(
				`/${deviceId}/broadcast/conversations/${recipientId}/messages`,
				{
					params: {
						page: pagination.page,
						limit: pagination.limit || 50,
					},
				}
			);
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
					};
				}),
			};
		} catch (err) {
			return {
				messageLabels: [],
				messages: [],
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
			await api.post(`/${deviceId}/broadcast/conversations/${recipientId}/send-message`, message);
			return true;
		} catch (err) {
			return false;
		}
	}

	static async ConversationLabels(phone_number: string, labels: string[]) {
		try {
			await api.post(`/phonebook/set-labels/phone/${phone_number}`, {
				labels,
				numbers: [phone_number],
			});
			return true;
		} catch (err) {
			return false;
		}
	}

	static async broadcastReport() {
		try {
			const { data } = await api.get(`/broadcast/reports`);
			return data.reports as {
				broadcast_id: string;
				name: string;
				description: string;
				template_name: string;
				status: 'ACTIVE' | 'PAUSED';
				sent: number;
				failed: number;
				pending: number;
				isPaused: boolean;
				createdAt: string;
			}[];
		} catch (err) {
			return [];
		}
	}

	static async pauseBroadcast(broadcastId: string) {
		try {
			await api.post(`/broadcast/${broadcastId}/pause`);
			return true;
		} catch (err) {
			return false;
		}
	}

	static async resumeBroadcast(broadcastId: string) {
		try {
			await api.post(`/broadcast/${broadcastId}/resume`);
			return true;
		} catch (err) {
			return false;
		}
	}

	static async deleteBroadcast(broadcastId: string) {
		try {
			await api.post(`/broadcast/${broadcastId}/delete`);
			return true;
		} catch (err) {
			return false;
		}
	}

	static async resendFailedBroadcast(broadcastId: string) {
		try {
			await api.post(`/broadcast/${broadcastId}/resend`);
			return true;
		} catch (err) {
			return false;
		}
	}

	static async downloadBroadcast(broadcastId: string) {
		const response = await api.get(`/broadcast/${broadcastId}/download`, {
			responseType: 'blob',
		});
		const blob = new Blob([response.data]);

		const contentDisposition = response.headers['content-disposition'];
		const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.*)"/);
		const filename = filenameMatch ? filenameMatch[1] : 'Campaign Report.csv';

		// Create a temporary link element
		const downloadLink = document.createElement('a');
		downloadLink.href = window.URL.createObjectURL(blob);
		downloadLink.download = filename; // Specify the filename

		// Append the link to the body and trigger the download
		document.body.appendChild(downloadLink);
		downloadLink.click();

		// Clean up - remove the link
		document.body.removeChild(downloadLink);
	}

	static async assignMessageLabels(deviceId: string, messageId: string, labels: string[]) {
		try {
			await api.post(`/${deviceId}/broadcast/${messageId}/assign-labels`, {
				labels,
			});
			return true;
		} catch (err) {
			return false;
		}
	}
	static async markRead(deviceId: string, message_id: string) {
		try {
			await api.post(`/${deviceId}/broadcast/mark-read/${message_id}`);
			return true;
		} catch (err) {
			return false;
		}
	}

	static async buttonResponseReport({
		campaignId,
		exportCSV,
	}: {
		campaignId: string;
		exportCSV?: boolean;
	}) {
		if (!exportCSV) {
			try {
				const { data } = await api.get(`/broadcast/${campaignId}/button-responses`);
				return data.responses as {
					button_text: string;
					recipient: string;
					responseAt: string;
					name: string;
					email: string;
				}[];
			} catch (err) {
				return null;
			}
		} else {
			const response = await api.get(`/broadcast/${campaignId}/button-responses?export_csv=true`, {
				responseType: 'blob',
			});
			const blob = new Blob([response.data]);

			const contentDisposition = response.headers['content-disposition'];
			const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.*)"/);
			const filename = filenameMatch ? filenameMatch[1] : 'Button Response Report.csv';

			// Create a temporary link element
			const downloadLink = document.createElement('a');
			downloadLink.href = window.URL.createObjectURL(blob);
			downloadLink.download = filename; // Specify the filename

			// Append the link to the body and trigger the download
			document.body.appendChild(downloadLink);
			downloadLink.click();

			// Clean up - remove the link
			document.body.removeChild(downloadLink);
		}
	}
}
