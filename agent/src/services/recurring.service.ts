import APIInstance from '../config/APIInstance';
import { Recurring } from '../store/types/RecurringState';

const validateRecurringResult = (list: Recurring[]) => {
	return (list ?? []).map((recurring) => {
		return {
			id: recurring.id ?? '',
			name: recurring.name ?? '',
			description: recurring.description ?? '',
			wish_from: recurring.wish_from ?? 'birthday',
			labels: recurring.labels ?? [],
			template_id: recurring.template_id ?? '',
			template_name: recurring.template_name ?? '',
			template_body: (recurring.template_body ?? []).map((body) => {
				return {
					custom_text: body.custom_text ?? '',
					phonebook_data: body.phonebook_data ?? '',
					variable_from: body.variable_from ?? 'custom_text',
					fallback_value: body.fallback_value ?? '',
				};
			}),
			template_header: {
				type: recurring.template_header?.type ?? '',
				link: recurring.template_header?.link ?? '',
				media_id: recurring.template_header?.media_id ?? '',
			},
			delay: recurring.delay ?? 0,
			startTime: recurring.startTime ?? '10:00',
			endTime: recurring.endTime ?? '18:00',
			active: recurring.active ?? 'ACTIVE',
		};
	});
};

export default class RecurringService {
	static async getRecurringList({ deviceId }: { deviceId: string }) {
		try {
			const { data } = await APIInstance.get(`/${deviceId}/broadcast/recurring`);
			return validateRecurringResult(data.list);
		} catch (err) {
			return [];
		}
	}

	static async createRecurring({
		deviceId,
		details,
	}: {
		deviceId: string;
		details: {
			id?: string;
			name: string;
			description: string;
			wish_from: 'birthday' | 'anniversary';
			labels: string[];
			template_id: string;
			template_name: string;
			template_body: {
				custom_text: string;
				phonebook_data: string;
				variable_from: 'custom_text' | 'phonebook_data';
				fallback_value: string;
			}[];
			template_header?: {
				type: 'IMAGE' | 'TEXT' | 'VIDEO' | 'DOCUMENT' | '';
				link: string;
				media_id: string;
			};
			delay: number;
			startTime: string;
			endTime: string;
		};
	}) {
		if (details.id === '') {
			delete details.id;
		}
		if (details.template_header?.type === '') {
			delete details.template_header;
		}
		const { data } = await APIInstance.post(`/${deviceId}/broadcast/recurring`, details);
		return validateRecurringResult([data.details]);
	}

	static async editRecurring({
		deviceId,
		details,
	}: {
		deviceId: string;
		details: {
			id: string;
			name: string;
			description: string;
			wish_from: 'birthday' | 'anniversary';
			labels: string[];
			template_id: string;
			template_name: string;
			template_body: {
				custom_text: string;
				phonebook_data: string;
				variable_from: 'custom_text' | 'phonebook_data';
				fallback_value: string;
			}[];
			template_header?: {
				type: 'IMAGE' | 'TEXT' | 'VIDEO' | 'DOCUMENT' | '';
				link: string;
				media_id: string;
			};
			delay: number;
			startTime: string;
			endTime: string;
		};
	}) {
		if (details.template_header?.type === '') {
			delete details.template_header;
		}
		const { data } = await APIInstance.put(
			`/${deviceId}/broadcast/recurring/${details.id}`,
			details
		);
		return validateRecurringResult([data]);
	}

	static async toggleRecurring({
		deviceId,
		recurringId,
	}: {
		deviceId: string;
		recurringId: string;
	}) {
		await APIInstance.post(`/${deviceId}/broadcast/recurring/${recurringId}/toggle`);
	}

	static async deleteRecurring({
		deviceId,
		recurringId,
	}: {
		deviceId: string;
		recurringId: string;
	}) {
		await APIInstance.delete(`/${deviceId}/broadcast/recurring/${recurringId}`);
	}

	static async rescheduleRecurring({
		deviceId,
		recurringId,
	}: {
		deviceId: string;
		recurringId: string;
	}) {
		await APIInstance.post(`/${deviceId}/broadcast/recurring/${recurringId}/reschedule`);
	}

	static async downloadRecurring({
		deviceId,
		recurringId,
	}: {
		deviceId: string;
		recurringId: string;
	}) {
		try {
			const response = await APIInstance.get(`/${deviceId}/broadcast/recurring/${recurringId}`);
			const blob = new Blob([response.data]);

			const contentDisposition = response.headers['content-disposition'];
			const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.*)"/);
			const filename = filenameMatch ? filenameMatch[1] : 'Recurring Report.csv';

			// Create a temporary link element
			const downloadLink = document.createElement('a');
			downloadLink.href = window.URL.createObjectURL(blob);
			downloadLink.download = filename; // Specify the filename

			// Append the link to the body and trigger the download
			document.body.appendChild(downloadLink);
			downloadLink.click();

			// Clean up - remove the link
			document.body.removeChild(downloadLink);
		} catch (err) {
			//ignore
		}
	}
}
