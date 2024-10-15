import api from '@/lib/api';
import { TWhatsappFlow } from '@/schema/whatsapp-flow';

export default class ChatBotService {
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
