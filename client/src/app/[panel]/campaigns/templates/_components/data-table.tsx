import Each from '@/components/containers/each';
import { RowButton } from '@/components/containers/row-button';
import Show from '@/components/containers/show';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Template } from '@/schema/template';
import { useParams } from 'next/navigation';

export function DataTable({ records }: { records: Template[] }) {
	const params = useParams();

	return (
		<div className='w-full'>
			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableCell>S.No.</TableCell>
							<TableCell>Name</TableCell>
							<TableCell>Status</TableCell>
							<TableCell>Category</TableCell>
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
										<RowButton href={`/${params.panel}/campaigns/templates/${record.id}`}>
											<TableCell>{index + 1}.</TableCell>
											<TableCell>{record.name}</TableCell>
											<TableCell>{record.status}</TableCell>
											<TableCell>{record.category}</TableCell>
										</RowButton>
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
