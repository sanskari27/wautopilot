import APIInstance from '../config/APIInstance';
import { PhonebookRecord } from '../store/types/PhonebookState';

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
		const { data } = await APIInstance.post(`/phonebook`, {
			records: [record],
		});
		return data.records[0] as PhonebookRecord;
	}

	static async updateRecord(
		id: string,
		record: Record<string, string | string[] | Record<string, string>>
	) {
		const { data } = await APIInstance.put(`/phonebook/${id}`, record);
		return data.records as PhonebookRecord;
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
