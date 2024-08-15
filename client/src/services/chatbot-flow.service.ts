import api from '@/lib/api';
import { ChatbotFlow } from '@/types/chatbot';

const validateChatBot = (bot: any) => {
	return {
		id: bot.bot_id ?? '',
		name: bot.name ?? '',
		isActive: bot.isActive ?? false,
		options: bot.options ?? '',
		respond_to: bot.respond_to ?? '',
		trigger: bot.trigger ?? '',
		nurturing: bot.nurturing ?? [],
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
				variable_from: 'custom_text' | 'phonebook_data';
				fallback_value: string;
			}[];
			template_header: {
				type: 'IMAGE' | 'TEXT' | 'VIDEO' | 'DOCUMENT' | 'AUDIO' | '';
				media_id: string;
			};
		}[];
	}) {
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
			trigger: string;
			options: string;
			isActive: boolean;
			nurturing: {
				after: number;
				respond_type: 'template' | 'normal';
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
					variable_from: 'custom_text' | 'phonebook_data';
					fallback_value: string;
				}[];
				template_header: {
					type: 'IMAGE' | 'TEXT' | 'VIDEO' | 'DOCUMENT' | 'AUDIO' | '';
					media_id: string;
				};
			}[];
		};
	}) {
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

	static async editChatbotFlow({
		botId,
		details,
	}: {
		botId: string;
		details: {
			trigger: string[];
			options: string;
			name: string;
			isActive: boolean;
		};
	}) {
		const { data } = await api.patch(`/chatbot/flows/${botId}`, details);
		return validateChatBot(data.flow);
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
}
