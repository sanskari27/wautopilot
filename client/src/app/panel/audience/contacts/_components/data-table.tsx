'use client';
import Each from '@/components/containers/each';
import Show from '@/components/containers/show';
import { SearchBar } from '@/components/elements/searchbar';
import {
	Table,
	TableBody,
	TableCell,
	TableCellLink,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { ContactWithID } from '@/schema/phonebook';
import { useState } from 'react';

export function DataTable({ records: list }: { records: ContactWithID[] }) {
	const [searchText, setSearchText] = useState('');
	const records = list.filter(
		(record) =>
			record.formatted_name.toLowerCase().includes(searchText.toLowerCase()) ||
			record.phones.some(({ phone }) => phone.toLowerCase().includes(searchText.toLowerCase()))
	);

	return (
		<div className='w-full'>
			<div className='flex justify-end'>
				<div className='flex items-center rounded-lg p-2 w-[450px] '>
					<SearchBar
						onChange={setSearchText}
						onSubmit={setSearchText}
						placeholders={['Search by name', 'Search by phone']}
					/>
				</div>
			</div>
			<div className='border border-dashed border-gray-700 rounded-2xl overflow-hidden'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableCell className='w-[70px]'>S.No.</TableCell>
							<TableCell>Name</TableCell>
						</TableRow>
					</TableHeader>
					<TableBody>
						<Show>
							<Show.When condition={records.length === 0}>
								<TableRow>
									<TableCell colSpan={5} className='h-24 text-center'>
										No results.
									</TableCell>
								</TableRow>
							</Show.When>
							<Show.Else>
								<Each
									items={records}
									render={(record, index) => (
										<TableRow>
											<TableCell>{index + 1}.</TableCell>
											<TableCellLink
												href={`?contact=${record.id}&data=${JSON.stringify(record)}`}
												className='w-full inline-block'
											>
												{record.formatted_name}
											</TableCellLink>
										</TableRow>
									)}
								/>
							</Show.Else>
						</Show>
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
