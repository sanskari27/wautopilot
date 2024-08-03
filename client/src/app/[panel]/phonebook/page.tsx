import FieldSearch from '@/components/elements/filters/fieldSearch';
import api from '@/lib/api';
import { PhonebookRecord } from '@/types/phonebook';
import TagsFilter from './(components)/TagsFilter';
import { DataTable } from './(components)/data-table';

export default async function Tasks({
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
			limit: searchParams.limit || '10',
			search: search || [],
			labels: searchParams.tags || [],
		},
	});
	const records = data.records as PhonebookRecord[];
	const totalRecords = data.totalRecords as number;

	return (
		<div className='flex flex-col gap-4 justify-center p-4'>
			<div className='justify-between'>
				<h2 className='text-2xl font-bold'>Phonebook</h2>
				<div></div>
			</div>
			<div className='flex items-start gap-3'>
				<div className='flex-1'>
					<FieldSearch />
				</div>
				<div>
					<TagsFilter />
				</div>
			</div>
			<DataTable records={records} maxRecord={totalRecords} />
		</div>
	);
}
