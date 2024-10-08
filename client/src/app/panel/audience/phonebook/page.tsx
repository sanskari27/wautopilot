import api from '@/lib/api';
import { PhonebookRecordWithID } from '@/schema/phonebook';
import { DataTable } from './_components/data-table';

export default async function Phonebook({
	searchParams,
}: {
	searchParams: {
		tags: string[];
		page: string;
		limit: string;
	} & {
		[key: string]: string;
	};
}) {
	const search = [];
	for (const key in searchParams) {
		if (key.startsWith('search_')) {
			search.push(key.replace('search_', '') + '=' + searchParams[key]);
		}
	}

	const { data } = await api.get(`/phonebook`, {
		params: {
			page: searchParams.page || '1',
			limit: searchParams.limit || '5000',
			search: search || [],
			labels: searchParams.tags || [],
		},
	});
	const records = data.records as PhonebookRecordWithID[];
	const totalRecords = data.totalRecords as number;

	return (
		<>
			<DataTable records={records} maxRecord={totalRecords} />
		</>
	);
}
