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
						value:
							nurture.after % 86400 === 0
								? nurture.after / 86400
								: nurture.after % 3600 === 0
								? nurture.after / 3600
								: nurture.after / 60,
						type:
							nurture.after % 86400 === 0
								? 'days'
								: nurture.after % 3600 === 0
								? 'hours'
								: 'minutes',
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
			isActive: bot.isActive ?? true,
		};
	});
};

export default class ChatBotService {
	static async listChatBots({ deviceId }: { deviceId: string }) {
		try {
			const { data } = await APIInstance.get(`/${deviceId}/chatbot`);
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
		if (details.respond_type === 'normal') {
			delete details.template_header;
		}
		for (let i = 0; i < details.nurturing.length; i++) {
			if ((details.nurturing[i].template_header?.type ?? '') === '') {
				delete details.nurturing[i].template_header;
			}
		}
		const { data } = await APIInstance.post(`/${deviceId}/chatbot`, details);
		return validateChatBot([data.bot]);
	}

	static async DeleteBot({ deviceId, botId }: { deviceId: string; botId: string }) {
		try {
			const { data } = await APIInstance.delete(`/${deviceId}/chatbot/${botId}`);

			return validateChatBot([data.bot]);
		} catch (err) {
			return [];
		}
	}

	static async toggleBot({ deviceId, botId }: { deviceId: string; botId: string }) {
		try {
			const { data } = await APIInstance.put(`/${deviceId}/chatbot/${botId}`);

			return validateChatBot([data.bot]);
		} catch (err) {
			return [];
		}
	}

	static async downloadChatBot({ deviceId, botId }: { deviceId: string; botId: string }) {
		try {
			const response = await APIInstance.get(`/${deviceId}/chatbot/${botId}/download-response`, {
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
		deviceId,
		botId,
		details,
	}: {
		deviceId: string;
		botId: string;
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
		if (details.respond_type === 'normal') {
			delete details.template_header;
		}
		for (let i = 0; i < details.nurturing.length; i++) {
			if ((details.nurturing[i].template_header?.type ?? '') === '') {
				delete details.nurturing[i].template_header;
			}
		}
		const { data } = await APIInstance.patch(`/${deviceId}/chatbot/${botId}`, details);
		return validateChatBot([data.bot]);
	}
}
