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
		trigger: string;
		respond_to: string;
		options: string;
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
			respond_to: string;
			options: string;
		};
	}) {
		const { data } = await api.patch(`/chatbot/flows/${bot_id}`, details);
		return validateChatBot(data.flow);
	}
	static async updateNodesAndEdges(botId: string, details: { nodes: any[]; edges: any[] }) {
		const { data } = await api.patch(`/chatbot/flows/${botId}`, details);
		return validateChatBot(data.flow);
	}
	static async deleteChatbotFlow(botId: string) {
		try {
			const { data } = await api.delete(`/chatbot/flows/${botId}`);

			return validateChatBot(data.flow);
		} catch (err) {
			return [];
		}
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
			respond_to: string;
			trigger: string;
			trigger_gap_seconds: number;
			response_delay_seconds: number;
			options: string;
			name: string;
			isActive: boolean;
		};
	}) {
		const { data } = await api.patch(`/chatbot/flows/${botId}`, details);
		return validateChatBot(data.flow);
	}

	static async getNodesAndEdges(botId: string) {
		const { data } = await api.get(`/chatbot/flows/${botId}`);
		return {
			nodes: data.flow.nodes,
			edges: data.flow.edges,
		};
	}
}
