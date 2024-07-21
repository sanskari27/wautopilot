import APIInstance from '../config/APIInstance';

export default class PhoneBookService {
	static async allLabels() {
		try {
			const { data } = await APIInstance.get(`/phonebook/all-labels`);
			return data.labels as string[];
		} catch (err) {
			return [];
		}
	}
	static async export(labels: string[]) {
		const { data } = await APIInstance.get(`/phonebook/export`, {
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
		await APIInstance.post(`/phonebook`, {
			records: [record],
		});
	}

	static async updateRecord(
		id: string,
		record: Record<string, string | string[] | Record<string, string>>
	) {
		await APIInstance.put(`/phonebook/${id}`, record);
	}

	static async deleteRecords(ids: string[]) {
		await APIInstance.post(`/phonebook/delete-multiple`, {
			ids,
		});
	}

	static async assignLabels(ids: string[], labels: string[] = []) {
		await APIInstance.post(`/phonebook/set-labels`, {
			ids,
			labels,
		});
	}

	static bulkUpload(file: File, labels: string[] = []) {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('labels', labels.join(','));
		return APIInstance.post(`/phonebook/bulk-upload`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	}
}
