/* eslint-disable @typescript-eslint/no-explicit-any */
import APIInstance from '../config/APIInstance';

function processDoc(data: any) {
	return {
		shorten_link: data.shorten_link as string,
		link: data.link as string,
		base64: data.base64 as string,
		id: data.id as string,
		title: data.title as string,
		isWhatsappLink: data.isWhatsappLink as boolean,
		number: (data.number as string) ?? '',
		message: (data.message as string) ?? '',
	};
}
export default class ShortenerService {
	static async createShortenURL(details: {
		type: 'whatsapp' | 'link';
		number?: string;
		message?: string;
		title: string;
		link?: string;
	}) {
		const { data } = await APIInstance.post(`/shortener`, details);
		return processDoc(data.details);
	}

	static async listAll() {
		try {
			const { data } = await APIInstance.get(`/shortener`);
			return data.list.map(processDoc);
		} catch (err) {
			return [];
		}
	}

	static async deleteLink(id: string) {
		await APIInstance.delete(`/shortener/${id}`);
	}

	static async updateShortenURL(
		id: string,
		details: {
			type: 'whatsapp' | 'link';
			number?: string;
			message?: string;
			title: string;
			link?: string;
		}
	) {
		const { data } = await APIInstance.patch(`/shortener/${id}`, details);
		return processDoc(data.details);
	}
}
