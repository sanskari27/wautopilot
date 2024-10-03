import api from '@/lib/api';
import { ChatBot } from '@/schema/chatbot';
import { TWhatsappFlow } from '@/schema/whatsapp-flow';

const validateChatBot = (bot: any) => {
	return {
		id: bot.bot_id ?? '',
		reply_to_message: bot.reply_to_message ?? false,
		respond_to: bot.respond_to ?? 'ALL',
		trigger: bot.trigger ?? '',
		trigger_gap_time: (bot.trigger_gap_seconds % 3600 === 0
			? bot.trigger_gap_seconds / 3600
			: bot.trigger_gap_seconds % 60 === 0
			? bot.trigger_gap_seconds / 60
			: bot.trigger_gap_seconds
		).toString(),
		trigger_gap_type:
			bot.trigger_gap_seconds % 3600 === 0
				? 'HOUR'
				: bot.trigger_gap_seconds % 60 === 0
				? 'MINUTE'
				: 'SEC',
		response_delay_time: (bot.response_delay_seconds % 3600 === 0
			? bot.response_delay_seconds / 3600
			: bot.response_delay_seconds % 60 === 0
			? bot.response_delay_seconds / 60
			: bot.response_delay_seconds
		).toString(),
		response_delay_type:
			bot.response_delay_seconds % 3600 === 0
				? 'HOUR'
				: bot.response_delay_seconds % 60 === 0
				? 'MINUTE'
				: 'SEC',
		options: bot.options ?? 'INCLUDES_IGNORE_CASE',
		respond_type: bot.respond_type ?? 'template',
		startAt: bot.startAt ?? '',
		endAt: bot.endAt ?? '',
		message: bot.message ?? '',
		images: bot.images.map((image: any) => image) ?? [],
		videos: bot.videos.map((video: any) => video) ?? [],
		audios: bot.audios.map((audio: any) => audio) ?? [],
		documents: bot.documents.map((document: any) => document) ?? [],
		contacts: bot.contacts.map((contact: any) => contact) ?? [],
		template_id: bot.template_id ?? '',
		template_name: bot.template_name ?? '',
		template_body:
			bot.template_body.map((body: any) => {
				return {
					custom_text: body.custom_text ?? '',
					phonebook_data: body.phonebook_data ?? '',
					variable_from: body.variable_from ?? 'custom_text',
					fallback_value: body.fallback_value ?? '',
				};
			}) ?? [],
		template_header: {
			type: bot.template_header?.type ?? '',
			link: bot.template_header?.link ?? '',
			media_id: bot.template_header?.media_id ?? '',
		},
		group_respond: bot.group_respond ?? false,
		nurturing: bot.nurturing.map((nurture: any) => {
			return {
				after: {
					value: (nurture.after % 86400 === 0
						? nurture.after / 86400
						: nurture.after % 3600 === 0
						? nurture.after / 3600
						: nurture.after / 60
					).toString(),
					type:
						nurture.after % 86400 === 0 ? 'days' : nurture.after % 3600 === 0 ? 'hours' : 'minutes',
				},
				start_from: nurture.start_from ?? '',
				end_at: nurture.end_at ?? '',
				template_id: nurture.template_id ?? '',
				template_name: nurture.template_name ?? '',
				template_body: nurture.template_body.map((body: any) => {
					return {
						custom_text: body.custom_text ?? '',
						phonebook_data: body.phonebook_data ?? '',
						variable_from: body.variable_from ?? 'custom_text',
						fallback_value: body.fallback_value ?? '',
					};
				}),
				template_header: {
					type: nurture.template_header?.type ?? '',
					link: nurture.template_header?.link ?? '',
					media_id: nurture.template_header?.media_id ?? '',
				},
			};
		}),
		forward: {
			number: bot.forward?.number ?? '',
			message: bot.forward?.message ?? '',
		},
		isActive: bot.isActive ?? true,
	} as ChatBot;
};

export default class ChatBotService {
	static async listChatBots(): Promise<ChatBot[]> {
		try {
			const { data } = await api.get(`/chatbot`);
			return data.bots.map(validateChatBot);
		} catch (err) {
			return [];
		}
	}

	static async createBot(details: {
		reply_to_message: boolean;
		trigger: string[];
		trigger_gap_seconds: number;
		response_delay_seconds: number;
		options: string;
		startAt: string;
		endAt: string;
		respond_type: string;
		message: string;
		images: string[];
		videos: string[];
		audios: string[];
		documents: string[];
		contacts: string[];
		template_id: string;
		template_name: string;
		template_body: {
			custom_text: string;
			phonebook_data: string;
			variable_from: string;
			fallback_value: string;
		}[];
		template_header?: {
			type: string;
			link?: string;
			media_id?: string;
		};
		nurturing: {
			after: number;
			start_from: string;
			end_at: string;
			template_id: string;
			template_name: string;
			template_body: {
				custom_text: string;
				phonebook_data: string;
				variable_from: string;
				fallback_value: string;
			}[];
			template_header?: {
				type: string;
				link?: string;
				media_id?: string;
			};
		}[];
		forward: {
			number: string;
			message: string;
		};
	}) {
		if (details.respond_type === 'normal') {
			delete details.template_header;
		}
		for (let i = 0; i < details.nurturing.length; i++) {
			if ((details.nurturing[i].template_header?.type ?? '') === '') {
				delete details.nurturing[i].template_header;
			}
		}
		const { data } = await api.post(`/chatbot`, details);
		return validateChatBot(data.bot);
	}

	static async deleteBot(botId: string) {
		try {
			const { data } = await api.delete(`/chatbot/${botId}`);

			return validateChatBot(data.bot);
		} catch (err) {
			return [];
		}
	}

	static async toggleBot(botId: string) {
		try {
			const { data } = await api.put(`/chatbot/${botId}`);

			return validateChatBot([data.bot]);
		} catch (err) {
			return [];
		}
	}

	static async downloadChatBot(botId: string) {
		try {
			const response = await api.get(`/chatbot/${botId}/download-response`, {
				responseType: 'blob',
			});
			const blob = new Blob([response.data]);

			const contentDisposition = response.headers['content-disposition'];
			const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.*)"/);
			const filename = filenameMatch ? filenameMatch[1] : 'downloaded-file';

			// Create a temporary link element
			const downloadLink = document.createElement('a');
			downloadLink.href = window.URL.createObjectURL(blob);
			downloadLink.download = filename; // Specify the filename

			// Append the link to the body and trigger the download
			document.body.appendChild(downloadLink);
			downloadLink.click();

			// Clean up - remove the link
			document.body.removeChild(downloadLink);
		} catch (err) {
			return [];
		}
	}

	static async editChatBot({
		botId,
		details,
	}: {
		botId: string;
		details: {
			reply_to_message: boolean;
			trigger: string[];
			trigger_gap_seconds: number;
			response_delay_seconds: number;
			options: string;
			startAt: string;
			endAt: string;
			respond_type: string;
			message: string;
			images: string[];
			videos: string[];
			audios: string[];
			documents: string[];
			contacts: string[];
			template_id: string;
			template_name: string;
			template_body: {
				custom_text: string;
				phonebook_data: string;
				variable_from: string;
				fallback_value: string;
			}[];
			template_header?: {
				type: string;
				link?: string;
				media_id?: string;
			};
			nurturing: {
				after: number;
				start_from: string;
				end_at: string;
				template_id: string;
				template_name: string;
				template_body: {
					custom_text: string;
					phonebook_data: string;
					variable_from: string;
					fallback_value: string;
				}[];
				template_header?: {
					type: string;
					link?: string;
					media_id?: string;
				};
			}[];
			forward: {
				number: string;
				message: string;
			};
		};
	}) {
		if (details.respond_type === 'normal') {
			delete details.template_header;
		}
		for (let i = 0; i < details.nurturing.length; i++) {
			if ((details.nurturing[i].template_header?.type ?? '') === '') {
				delete details.nurturing[i].template_header;
			}
		}
		const { data } = await api.patch(`/chatbot/${botId}`, details);
		return data.success;
	}

	static async exportWhatsappFlowData(id: string) {
		const response = await api.get(`/chatbot/whatsapp-flows/${id}/export`, {
			responseType: 'blob',
		});
		const blob = new Blob([response.data]);

		const contentDisposition = response.headers['content-disposition'];
		const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.*)"/);
		const filename = filenameMatch ? filenameMatch[1] : 'downloaded-file';

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

	static async createWhatsappFlow(details: {
		name: string;
		categories: (
			| 'SIGN_UP'
			| 'SIGN_IN'
			| 'APPOINTMENT_BOOKING'
			| 'LEAD_GENERATION'
			| 'CONTACT_US'
			| 'CUSTOMER_SUPPORT'
			| 'SURVEY'
			| 'OTHER'
		)[];
	}) {
		const { data } = await api.post(`/chatbot/whatsapp-flows`, details);
		return data.id;
	}

	static async updateWhatsappFlow(
		flowId: string,
		details: {
			name: string;
			categories: (
				| 'SIGN_UP'
				| 'SIGN_IN'
				| 'APPOINTMENT_BOOKING'
				| 'LEAD_GENERATION'
				| 'CONTACT_US'
				| 'CUSTOMER_SUPPORT'
				| 'SURVEY'
				| 'OTHER'
			)[];
		}
	) {
		await api.patch(`/chatbot/whatsapp-flows/${flowId}`, details);
	}

	static async listWhatsappFlows() {
		try {
			const { data } = await api.get(`/chatbot/whatsapp-flows`);
			return data.flows as {
				id: string;
				name: string;
				status: 'DRAFT' | 'PUBLISHED';
				categories: (
					| 'SIGN_UP'
					| 'SIGN_IN'
					| 'APPOINTMENT_BOOKING'
					| 'LEAD_GENERATION'
					| 'CONTACT_US'
					| 'CUSTOMER_SUPPORT'
					| 'SURVEY'
					| 'OTHER'
				)[];
			}[];
		} catch (err) {
			return null;
		}
	}

	static async whatsappFlowContents(id: string) {
		try {
			const { data } = await api.get(`/chatbot/whatsapp-flows/${id}/assets`);
			return data.screens;
		} catch (err) {
			return null;
		}
	}

	static async saveWhatsappFlowContents(id: string, data: TWhatsappFlow) {
		await api.post(`/chatbot/whatsapp-flows/${id}/assets`, data);
	}

	static async publishWhatsappFlow(flowId: string) {
		const { data } = await api.post(`/chatbot/whatsapp-flows/${flowId}/publish`);
		return data.success;
	}

	static async deleteWhatsappFlow(flowId: string) {
		const { data } = await api.delete(`/chatbot/whatsapp-flows/${flowId}`);
		return data.success;
	}
}
