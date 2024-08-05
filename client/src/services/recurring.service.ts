import api from '@/lib/api';
import { RecurringWithId } from '@/schema/broadcastSchema';

const validateRecurringResult = (recurring: any): RecurringWithId => {
	return {
		id: recurring.id ?? '',
		name: recurring.name ?? '',
		description: recurring.description ?? '',
		wish_from: recurring.wish_from ?? 'birthday',
		labels: recurring.labels ?? [],
		template_id: recurring.template_id ?? '',
		template_name: recurring.template_name ?? '',
		template_body: (recurring.template_body ?? []).map((body: any) => {
			return {
				custom_text: body.custom_text ?? '',
				phonebook_data: body.phonebook_data ?? '',
				variable_from: body.variable_from ?? 'custom_text',
				fallback_value: body.fallback_value ?? '',
			};
		}),
		template_header: recurring.template_header,
		delay: recurring.delay ?? 0,
		startTime: recurring.startTime ?? '10:00',
		endTime: recurring.endTime ?? '18:00',
		active: recurring.active ?? 'ACTIVE',
	};
};

export default class RecurringService {
	static async getRecurringList(): Promise<RecurringWithId[]> {
		try {
			const { data } = await api.get(`/broadcast/recurring`);
			return data.list.map(validateRecurringResult);
		} catch (err) {
			return [];
		}
	}

	static async createRecurring(details: {
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
	}) {
		if (details.id === '') {
			delete details.id;
		}
		if (details.template_header?.type === '') {
			delete details.template_header;
		}
		const { data } = await api.post(`/broadcast/recurring`, details);
		return validateRecurringResult(data.details);
	}

	static async editRecurring(details: {
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
	}) {
		if (details.template_header?.type === '') {
			delete details.template_header;
		}
		const { data } = await api.put(`/broadcast/recurring/${details.id}`, details);
		return validateRecurringResult(data);
	}

	static async toggleRecurring(recurringId: string) {
		await api.post(`/broadcast/recurring/${recurringId}/toggle`);
	}

	static async deleteRecurring(recurringId: string) {
		await api.delete(`/broadcast/recurring/${recurringId}`);
	}

	static async rescheduleRecurring(recurringId: string) {
		await api.post(`/broadcast/recurring/${recurringId}/reschedule`);
	}

	static async downloadRecurring(recurringId: string) {
		try {
			const response = await api.get(`/broadcast/recurring/${recurringId}`);
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
