import api from '@/lib/api';

export default class ExtraService {
	static async getFAQs() {
		try {
			const { data } = await api.get('/extras/faqs');
			return data.list as { title: string; info: string }[];
		} catch (err) {
			return null;
		}
	}

	static async getTestimonials() {
		try {
			const { data } = await api.get('/extras/testimonials');
			return (data.list ?? []).map((list: any) => {
				return {
					description: list.description,
					name: list.name,
					title: list.title,
					photo_url: list.photo_url,
				};
			}) as { description: string; name: string; title: string; photo_url: string }[];
		} catch (err) {
			return null;
		}
	}

	static async createFAQs(list: { title: string; info: string }[]) {
		await api.post('/extras/faqs', { list });
	}

	static async createTestimonials(
		list: { title: string; name: string; photo_url: string; description: string }[]
	) {
		await api.post('/extras/testimonials', { list });
	}
}
