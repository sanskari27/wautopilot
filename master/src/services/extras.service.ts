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

	static async createFAQs(list: any) {
		await APIInstance.post('/extras/faqs', { list });
	}
}
