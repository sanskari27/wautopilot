'use client';
import { useTemplates } from '@/components/context/templates';
import { SearchBar } from '@/components/elements/searchbar';
import { useState } from 'react';
import { AddTemplate } from './_components/buttons';
import { DataTable } from './_components/data-table';

export default function Templates() {
	const templates = useTemplates();
	const [searchText, setSearchText] = useState('');
	const records = templates.filter(
		(record) =>
			record.name.toLowerCase().includes(searchText.toLowerCase()) ||
			record.category.toLowerCase().includes(searchText.toLowerCase()) ||
			record.status.toLowerCase().includes(searchText.toLowerCase())
	);

	return (
		<div className='flex flex-col gap-4 justify-center p-4'>
			<div className='justify-between flex items-end'>
				<h2 className='text-2xl font-bold'>Templates</h2>
				<div className='flex gap-x-2 gap-y-1 flex-wrap items-end'>
					<AddTemplate />
					<div className='flex items-center rounded-lg w-[450px] '>
						<SearchBar
							onChange={setSearchText}
							onSubmit={setSearchText}
							placeholders={['Search by name', 'Search by category', 'Search by status']}
						/>
					</div>
				</div>
			</div>

			<DataTable records={records} />
		</div>
	);
}
