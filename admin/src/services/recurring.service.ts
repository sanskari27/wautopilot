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
			const { data } = await APIInstance.get(`/${deviceId}/message/recurring-broadcast`);
			return validateRecurringResult(data.list);
		} catch (err) {
			//ignore
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
		const { data } = await APIInstance.post(`/${deviceId}/message/recurring-broadcast`, details);
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
			`/${deviceId}/message/recurring-broadcast/${details.id}`,
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
		await APIInstance.post(`/${deviceId}/message/recurring-broadcast/${recurringId}/toggle`);
	}

	static async deleteRecurring({
		deviceId,
		recurringId,
	}: {
		deviceId: string;
		recurringId: string;
	}) {
		await APIInstance.delete(`/${deviceId}/message/recurring-broadcast/${recurringId}`);
	}

	static async rescheduleRecurring({
		deviceId,
		recurringId,
	}: {
		deviceId: string;
		recurringId: string;
	}) {
		await APIInstance.post(`/${deviceId}/message/recurring-broadcast/${recurringId}/reschedule`);
	}
}
