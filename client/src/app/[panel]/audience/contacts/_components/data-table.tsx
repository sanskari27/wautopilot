import Each from '@/components/containers/each';
import Show from '@/components/containers/show';
import { Table, TableBody, TableCell, TableCellLink, TableHeader, TableRow } from '@/components/ui/table';
import { ContactWithID } from '@/schema/phonebook';

export function DataTable({ records }: { records: ContactWithID[] }) {
	return (
		<div className='w-full'>
			<div className='rounded-md border'>
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
