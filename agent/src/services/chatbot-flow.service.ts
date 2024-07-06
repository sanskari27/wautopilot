/* eslint-disable @typescript-eslint/no-explicit-any */
import APIInstance from '../config/APIInstance';

const validateChatBot = (bots: any) => {
	return bots.map((bot: any) => {
		return {
			id: bot.bot_id ?? '',
			name: bot.name ?? '',
			respond_to: bot.respond_to ?? 'ALL',
			trigger: bot.trigger ?? '',
			trigger_gap_seconds: bot.trigger_gap_seconds ?? 1,
			response_delay_seconds: bot.response_delay_seconds ?? 1,
			options: bot.options ?? 'INCLUDES_IGNORE_CASE',
			isActive: bot.isActive ?? false,
		};
	});
};

export default class ChatbotFlowService {
	static async listChatBots({ deviceId }: { deviceId: string }) {
		try {
			const { data } = await APIInstance.get(`/${deviceId}/chatbot/flows`);
			return validateChatBot(data.flows);
		} catch (err) {
			return [];
		}
	}
	static async createChatbotFlow({
		device_id,
		details,
	}: {
		device_id: string;
		details: {
			name: string;
			trigger: string;
			respond_to: string;
			options: string;
		};
	}) {
		const { data } = await APIInstance.post(`/${device_id}/chatbot/flows`, details);
		return {
			id: data.flow.bot_id ?? '',
			name: data.flow.name ?? '',
			isActive: data.flow.isActive ?? false,
			options: data.flow.options ?? '',
			respond_to: data.flow.respond_to ?? '',
			trigger: data.flow.trigger ?? '',
		};
	}
	static async updateChatbotFlow({
		device_id,
		bot_id,
		details,
	}: {
		device_id: string;
		bot_id: string;
		details: {
			name: string;
			trigger: string;
			respond_to: string;
			options: string;
		};
	}) {
		const { data } = await APIInstance.patch(`/${device_id}/chatbot/flows/${bot_id}`, details);
		return {
			id: data.flow.bot_id ?? '',
			name: data.flow.name ?? '',
			isActive: data.flow.isActive ?? false,
			options: data.flow.options ?? '',
			respond_to: data.flow.respond_to ?? '',
			trigger: data.flow.trigger ?? '',
		};
	}
	static async updateNodesAndEdges(
		deviceId: string,
		botId: string,
		details: { nodes: any[]; edges: any[] }
	) {
		const { data } = await APIInstance.patch(`/${deviceId}/chatbot/flows/${botId}`, details);
		return {
			id: data.flow.bot_id ?? '',
			name: data.flow.name ?? '',
			isActive: data.flow.isActive ?? false,
			options: data.flow.options ?? '',
			respond_to: data.flow.respond_to ?? '',
			trigger: data.flow.trigger ?? '',
		};
	}
	static async deleteChatbotFlow({ deviceId, botId }: { deviceId: string; botId: string }) {
		try {
			const { data } = await APIInstance.delete(`/${deviceId}/chatbot/flows/${botId}`);

			return validateChatBot([data.flow]);
		} catch (err) {
			return [];
		}
	}

	static async toggleChatbotFlow({ deviceId, botId }: { deviceId: string; botId: string }) {
		try {
			const { data } = await APIInstance.put(`/${deviceId}/chatbot/flows/${botId}`);

			return validateChatBot([data.flow]);
		} catch (err) {
			return [];
		}
	}

	static async editChatbotFlow({
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
			name: string;
			isActive: boolean;
		};
	}) {
		const { data } = await APIInstance.patch(`/${deviceId}/chatbot/flows/${botId}`, details);
		return validateChatBot([data.flow]);
	}

	static async getNodesAndEdges(deviceId: string, botId: string) {
		const { data } = await APIInstance.get(`/${deviceId}/chatbot/flows/${botId}`);
		return {
			nodes: data.flow.nodes,
			edges: data.flow.edges,
		};
	}
}
