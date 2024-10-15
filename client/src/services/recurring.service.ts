import { QuickTemplateMessageProps } from '@/app/panel/conversations/_components/message-input';
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
		delay: recurring.delay ?? 0,
		startTime: recurring.startTime ?? '10:00',
		endTime: recurring.endTime ?? '18:00',
		active: recurring.status ?? 'ACTIVE',
		header: {
			type: recurring.template_header?.type ?? 'NONE',
			text: (recurring.template_header?.text ?? []).map((text: any) => ({
				custom_text: text.custom_text ?? '',
				variable_from: text.variable_from ?? 'custom_text',
				phonebook_data: text.phonebook_data ?? '',
				fallback_value: text.fallback_value ?? '',
			})),
			media_id: recurring.header?.media_id ?? '',
		},
		body:
			(recurring.template_body ?? []).map((text: any) => ({
				custom_text: text.custom_text ?? '',
				variable_from: text.variable_from ?? 'custom_text',
				phonebook_data: text.phonebook_data ?? '',
				fallback_value: text.fallback_value ?? '',
			})) ?? [],
		carousel: {
			cards: (recurring.template_carousel?.cards ?? []).map((card: any) => ({
				header: {
					media_id: card.header.media_id ?? '',
				},
				body: (card.body ?? []).map((text: any) => ({
					custom_text: text.custom_text ?? '',
					variable_from: text.variable_from ?? 'custom_text',
					phonebook_data: text.phonebook_data ?? '',
					fallback_value: text.fallback_value ?? '',
				})),
				buttons: card.buttons ?? [],
			})),
		},
		buttons: recurring.template_buttons ?? [],
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

	static async createRecurring(details: QuickTemplateMessageProps) {
		if (details.header?.type === 'NONE') {
			delete details.header;
		}
		if (details.buttons?.length === 0) {
			delete details.buttons;
		}
		if (details.carousel?.cards.length === 0) {
			delete details.carousel;
		}
		const { data } = await api.post(`/broadcast/recurring`, {
			...details,
			template_header: details.header,
			template_body: details.body,
			template_buttons: details.buttons,
			template_carousel: details.carousel,
		});
		return validateRecurringResult(data.details);
	}

	static async editRecurring(
		details: {
			id: string;
			name: string;
			description: string;
			wish_from: 'birthday' | 'anniversary';
			labels: string[];
			delay: number;
			startTime: string;
			endTime: string;
		} & QuickTemplateMessageProps
	) {
		if (details.header?.type === 'NONE') {
			delete details.header;
		}
		const { data } = await api.put(`/broadcast/recurring/${details.id}`, {
			...details,
			template_header: details.header,
			template_body: details.body,
			template_buttons: details.buttons,
			template_carousel: details.carousel,
		});
		return validateRecurringResult(data);
	}

	static async toggleRecurring(recurringId: string) {
		const { data } = await api.post(`/broadcast/recurring/${recurringId}/toggle`);
		return data;
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
