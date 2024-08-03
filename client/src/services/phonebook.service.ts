import api from '@/lib/api';

export default class PhoneBookService {
	static async allLabels() {
		try {
			const { data } = await api.get(`/phonebook/all-labels`);
			return {
				labels: data.labels as string[],
				fields: data.fields as { label: string; value: string }[],
			};
		} catch (err) {
			return {
				labels: [],
				fields: [],
			};
		}
	}
	static async export(labels: string[]) {
		const { data } = await api.get(`/phonebook/export`, {
			params: {
				labels: labels.join(','),
			},
			responseType: 'blob',
		});

		const url = window.URL.createObjectURL(new Blob([data]));
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', 'phonebook.csv');
		document.body.appendChild(link);
		link.click();
	}

	static async addRecord(record: Record<string, string | string[] | Record<string, string>>) {
		await api.post(`/phonebook`, {
			records: [record],
		});
	}

	static async updateRecord(
		id: string,
		record: Record<string, string | string[] | Record<string, string>>
	) {
		await api.put(`/phonebook/${id}`, record);
	}

	static async deleteRecords(ids: string[]) {
		await api.post(`/phonebook/delete-multiple`, {
			ids,
		});
	}

	static async assignLabels(ids: string[], labels: string[] = []) {
		await api.post(`/phonebook/set-labels`, {
			ids,
			labels,
		});
	}

	static bulkUpload(file: File, labels: string[] = []) {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('labels', labels.join(','));
		return api.post(`/phonebook/bulk-upload`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	}

	static async addFields(data: { name: string; defaultValue: string }) {
		await api.post(`/phonebook/add-fields`, data);
	}
}
