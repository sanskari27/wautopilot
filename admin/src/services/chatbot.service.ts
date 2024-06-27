/* eslint-disable @typescript-eslint/no-explicit-any */
import APIInstance from '../config/APIInstance';

const validateChatBot = (bots: any) => {
	return bots.map((bot: any) => {
		return {
			id: bot.bot_id ?? '',
			respond_to: bot.respond_to ?? 'ALL',
			trigger: bot.trigger ?? '',
			trigger_gap_seconds: bot.trigger_gap_seconds ?? 1,
			response_delay_seconds: bot.response_delay_seconds ?? 1,
			options: bot.options ?? 'INCLUDES_IGNORE_CASE',
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
			template_body: bot.template_body.map((body: any) => body) ?? [],
			template_header: {
				type: bot.template_header.type ?? 'IMAGE',
				link: bot.template_header.link ?? '',
				media_id: bot.template_header.media_id ?? '',
			},
			group_respond: bot.group_respond ?? false,
			nurturing: bot.nurturing ?? [],
			isActive: bot.isActive ?? true,
		};
	});
};

export default class ChatBotService {
	static async listChatBots({ deviceId }: { deviceId: string }) {
		try {
			const { data } = await APIInstance.get(`/chatbot/${deviceId}`);

			return validateChatBot(data.bots);
		} catch (err) {
			return [];
		}
	}

	static async createBot({
		deviceId,
		details,
	}: {
		deviceId: string;
		details: {
			respond_to: string;
			trigger: string;
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
			group_respond: boolean;
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
		};
	}) {
		try {
			const { data } = await APIInstance.post(`/chatbot/${deviceId}`, details);

			return validateChatBot(data.bots);
		} catch (err) {
			return [];
		}
	}

	static async DeleteBot({ deviceId, botId }: { deviceId: string; botId: string }) {
		try {
			const { data } = await APIInstance.delete(`/chatbot/${deviceId}/${botId}`);

			return validateChatBot([data.bots]);
		} catch (err) {
			return [];
		}
	}

	static async toggleBot({ deviceId, botId }: { deviceId: string; botId: string }) {
		try {
			const { data } = await APIInstance.put(`/chatbot/${deviceId}/${botId}`);

			return validateChatBot([data.bots]);
		} catch (err) {
			return [];
		}
	}
}
