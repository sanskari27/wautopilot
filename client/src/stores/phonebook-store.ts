import { create } from 'zustand';
import api from '@/lib/api';
import { PhonebookRecordWithID } from '@/schema/phonebook';

interface PhonebookState {
	records: PhonebookRecordWithID[];
	totalRecords: number;
	isLoading: boolean;
	fetchPhonebook: (searchParams: {
		tags: string[];
		page: string;
		limit: string;
		[key: string]: string | string[];
	}) => Promise<void>;
}

export const usePhonebookStore = create<PhonebookState>((set) => ({
	records: [],
	totalRecords: 0,
	isLoading: false,

	fetchPhonebook: async (searchParams) => {
		set({ isLoading: true });

		try {
			const search = Object.keys(searchParams)
				.filter((key) => key.startsWith('search_'))
				.map((key) => `${key.replace('search_', '')}=${searchParams[key]}`);

			const { data } = await api.get(`/phonebook`, {
				params: {
					page: searchParams.page || '1',
					limit: searchParams.limit || '20',
					search: search || [],
					labels: searchParams.tags || [],
				},
			});

			set({
				records: data.records,
				totalRecords: data.totalRecords,
				isLoading: false,
			});
		} catch (error) {
			console.error('Error fetching phonebook data:', error);
			set({ isLoading: false });
		}
	},
}));
