/* eslint-disable @typescript-eslint/no-explicit-any */
import APIInstance from '../config/APIInstance';

export default class ExtrasService {
	static async getFAQs() {
		try {
			const { data } = await APIInstance.get('/extras/faqs');
			return (data.list ?? []).map((item: any) => ({
				title: item.title ?? '',
				info: item.info ?? '',
			}));
		} catch (e) {
			//ignore
		}
	}

	static async createFAQs(list: { title: string; info: string }[]) {
		await APIInstance.post('/extras/faqs', { list });
	}

	static async getTestimonials() {
		try {
			const { data } = await APIInstance.get('/extras/testimonials');
			return (data.list ?? []).map((item: any) => ({
				title: item.title ?? '',
				name: item.name ?? '',
				photo_url: item.photo_url ?? '',
				description: item.description ?? '',
			}));
		} catch (e) {
			//ignore
		}
	}

	static async createTestimonials(
		list: { title: string; name: string; photo_url: string; description: string }[]
	) {
		await APIInstance.post('/extras/testimonials', { list });
	}
}
