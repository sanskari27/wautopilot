import api from '@/lib/api';
import { ChatbotFlow } from '@/schema/chatbot-flow';
import { ChatbotFlow as TChatbotFlow } from '@/types/chatbot';

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
				type: nurturing.template_header?.type ?? 'NONE',
				media_id: nurturing.template_header?.media_id ?? '',
				link: nurturing.template_header?.link ?? '',
				text: nurturing.template_header?.text?.map((text: any) => ({
					custom_text: text.custom_text ?? '',
					phonebook_data: text.phonebook_data ?? '',
					variable_from: text.variable_from ?? 'custom_text',
					fallback_value: text.fallback_value ?? '',
				})),
			},
			template_buttons: nurturing.template_buttons ?? [],
			template_carousel: nurturing.template_carousel ?? [],
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
	static async createChatbotFlow(details: TChatbotFlow) {
		const { data } = await api.post(`/chatbot/flows`, details);
		console.log(data.flow)
		return validateChatBot(data.flow);
	}
	static async updateChatbotFlow({ bot_id, details }: { bot_id: string; details: TChatbotFlow }) {
		await api.patch(`/chatbot/flows/${bot_id}`, details);
	}
	static async updateNodesAndEdges(botId: string, details: { nodes: any[]; edges: any[] }) {
		await api.patch(`/chatbot/flows/${botId}`, details);
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
			return null;
		}
	}

	static async exportChatbotFlow(botId: string) {
		const response = await api.get(`/chatbot/flows/${botId}/download-responses`, {
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
