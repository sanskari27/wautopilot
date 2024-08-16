import api from '@/lib/api';
import { ChatbotFlow } from '@/schema/chatbot-flow';

const validateChatBot = (bot: any) => {
	return {
		id: bot.bot_id ?? '',
		name: bot.name ?? '',
		trigger: bot.trigger ?? [],
		options: bot.options ?? '',
		isActive: bot.isActive ?? false,
		nurturing: (bot.nurturing ?? []).map((nurturing: any) => ({
			message: nurturing.message ?? '',
			respond_type: nurturing.respond_type ?? 'normal',
			images: nurturing.images ?? [],
			videos: nurturing.videos ?? [],
			audios: nurturing.audios ?? [],
			documents: nurturing.documents ?? [],
			contacts: nurturing.contacts ?? [],
			template_id: nurturing.template_id ?? '',
			template_name: nurturing.template_name ?? '',
			template_body: (nurturing.template_body ?? []).map((body: any) => ({
				custom_text: body.custom_text ?? '',
				phonebook_data: body.phonebook_data ?? '',
				variable_from: body.variable_from ?? 'custom_text',
				fallback_value: body.fallback_value ?? '',
			})),
			template_header: {
				type: nurturing.template_header?.type ?? '',
				media_id: nurturing.template_header?.media_id ?? '',
			},
			//after will have the property as value and type will be calculated with days min or hours
			after: {
				type:
					nurturing.after % 86400 === 0 ? 'days' : nurturing.after % 3600 === 0 ? 'hours' : 'min',
				value: (nurturing.after % 86400 === 0
					? nurturing.after / 86400
					: nurturing.after % 3600 === 0
					? nurturing.after / 3600
					: nurturing.after / 60
				).toString(),
			},
		})),
		forward: bot.forward ?? { number: '', message: '' },
	} as ChatbotFlow;
};

export default class ChatbotFlowService {
	static async listChatBots(): Promise<ChatbotFlow[]> {
		try {
			const { data } = await api.get(`/chatbot/flows`);
			return data.flows.map(validateChatBot);
		} catch (err) {
			return [];
		}
	}
	static async createChatbotFlow(details: {
		name: string;
		trigger: string[];
		options: string;
		nurturing: {
			after: number;
			respond_type: 'template' | 'normal';
			message?: string;
			images?: string[];
			videos?: string[];
			audios?: string[];
			documents?: string[];
			contacts?: string[];
			template_id?: string;
			template_name?: string;
			template_body?: {
				custom_text: string;
				phonebook_data: string;
				variable_from: 'custom_text' | 'phonebook_data';
				fallback_value: string;
			}[];
			template_header?: {
				type: 'IMAGE' | 'TEXT' | 'VIDEO' | 'DOCUMENT' | 'AUDIO' | '';
				media_id: string;
			};
		}[];
	}) {
		details.nurturing.map((nurturing) => {
			if (nurturing.respond_type === 'template') {
				delete nurturing.message;
				delete nurturing.images;
				delete nurturing.videos;
				delete nurturing.audios;
				delete nurturing.documents;
				delete nurturing.contacts;
			} else {
				delete nurturing.template_id;
				delete nurturing.template_name;
				delete nurturing.template_body;
				delete nurturing.template_header;
			}
		});
		const { data } = await api.post(`/chatbot/flows`, details);
		return validateChatBot(data.flow);
	}
	static async updateChatbotFlow({
		bot_id,
		details,
	}: {
		bot_id: string;
		details: {
			name: string;
			trigger: string[];
			options: string;
			isActive: boolean;
			nurturing: {
				after: number;
				respond_type: 'template' | 'normal';
				message?: string;
				images?: string[];
				videos?: string[];
				audios?: string[];
				documents?: string[];
				contacts?: string[];
				template_id?: string;
				template_name?: string;
				template_body?: {
					custom_text: string;
					phonebook_data: string;
					variable_from: 'custom_text' | 'phonebook_data';
					fallback_value: string;
				}[];
				template_header?: {
					type: 'IMAGE' | 'TEXT' | 'VIDEO' | 'DOCUMENT' | 'AUDIO' | '';
					media_id: string;
				};
			}[];
		};
	}) {
		details.nurturing.map((nurturing) => {
			if (nurturing.respond_type === 'template') {
				delete nurturing.message;
				delete nurturing.images;
				delete nurturing.videos;
				delete nurturing.audios;
				delete nurturing.documents;
				delete nurturing.contacts;
			} else {
				delete nurturing.template_id;
				delete nurturing.template_name;
				delete nurturing.template_body;
				delete nurturing.template_header;
			}
		});
		const { data } = await api.patch(`/chatbot/flows/${bot_id}`, details);
		return validateChatBot(data.flow);
	}
	static async updateNodesAndEdges(botId: string, details: { nodes: any[]; edges: any[] }) {
		try {
			await api.patch(`/chatbot/flows/${botId}`, details);
		} catch (err) {
			console.log((err as any).response.data);
			throw err;
		}
	}
	static async deleteChatbotFlow(botId: string) {
		await api.delete(`/chatbot/flows/${botId}`);
	}

	static async toggleChatbotFlow(botId: string) {
		try {
			const { data } = await api.put(`/chatbot/flows/${botId}`);

			return validateChatBot(data.flow);
		} catch (err) {
			return [];
		}
	}

	static async getNodesAndEdges(botId: string) {
		try {
			const { data } = await api.get(`/chatbot/flows/${botId}`);
			return {
				nodes: data.flow.nodes,
				edges: data.flow.edges,
			};
		} catch (err) {
			console.log((err as any).response.data);

			return null;
		}
	}

	static async exportChatbotFlow(botId: string) {
		const response = await api.get(`/chatbot/flow/${botId}/download`, {
			responseType: 'blob',
		});
		const blob = new Blob([response.data]);

		const contentDisposition = response.headers['content-disposition'];
		const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.*)"/);
		const filename = filenameMatch ? filenameMatch[1] : 'Chatbot Flow Report.csv';

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
