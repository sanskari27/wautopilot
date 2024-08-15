import api from '@/lib/api';
import { ChatbotFlow } from '@/schema/chatbot-flow';

const validateChatBot = (bot: any) => {
	return {
		id: bot.bot_id ?? '',
		name: bot.name ?? '',
		isActive: bot.isActive ?? false,
		options: bot.options ?? '',
		respond_to: bot.respond_to ?? '',
		trigger: bot.trigger ?? '',
		nurturing: (bot.nurturing ?? []).map((item: any) => {
			return {
				after: {
					type: item.after % 86400 === 0 ? 'days' : item.after % 3600 === 0 ? 'hours' : 'min',
					value:
						item.after % 86400 === 0
							? item.after / 86400
							: item.after % 3600 === 0
							? item.after / 3600
							: item.after / 60,
				},
				respond_type: (item.respond_type as string) ?? '',
				message: (item.message as string) ?? '',
				images: item.images ?? [],
				videos: item.videos ?? [],
				audios: item.audios ?? [],
				documents: item.documents ?? [],
				contacts: item.contacts ?? [],
				template_id: (item.template_id as string) ?? '',
				template_name: (item.template_name as string) ?? '',
				template_body: item.template_body.map((body: any) => {
					return {
						custom_text: body.custom_text ?? '',
						phonebook_data: body.phonebook_data ?? '',
						variable_from: body.variable_from ?? '',
						fallback_value: body.fallback_value ?? '',
					};
				}),
				template_header: {
					type: item.template_header.type ?? '',
					media_id: item.template_header.media_id ?? '',
				},
			};
		}),
	} as ChatbotFlow;
};

export default class ChatbotFlowService {
	static async listChatBots(): Promise<ChatbotFlow[]> {
		try {
			const { data } = await api.get(`/chatbot/flows`);
			console.log(data.flows);
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
		console.log(details);
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
}
