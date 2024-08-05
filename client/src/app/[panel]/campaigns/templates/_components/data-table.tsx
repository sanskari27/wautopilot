import Each from '@/components/containers/each';
import Show from '@/components/containers/show';
import {
	Table,
	TableBody,
	TableCell,
	TableCellLink,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { TemplateWithID } from '@/schema/template';
import { useParams } from 'next/navigation';

export function DataTable({ records }: { records: TemplateWithID[] }) {
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
									render={(record, index) => {
										const link = `/${params.panel}/campaigns/templates/${record.id}`;
										return (
											<TableRow>
												<TableCellLink href={link}>{index + 1}.</TableCellLink>
												<TableCellLink href={link}>{record.name}</TableCellLink>
												<TableCellLink href={link}>{record.status}</TableCellLink>
												<TableCellLink href={link}>{record.category}</TableCellLink>
											</TableRow>
										);
									}}
								/>
							</Show.Else>
						</Show>
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
