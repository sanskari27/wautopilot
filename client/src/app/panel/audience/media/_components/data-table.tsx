import Each from '@/components/containers/each';
import Show from '@/components/containers/show';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { getFileSize } from '@/lib/utils';
import { Media } from '@/types/media';
import { DeleteButton, DownloadButton } from './buttons';

export function DataTable({ records }: { records: Media[] }) {
	return (
		<div className='w-full'>
			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableCell>S.No.</TableCell>
							<TableCell>File Name</TableCell>
							<TableCell>Type</TableCell>
							<TableCell>Size</TableCell>
							<TableCell>Action</TableCell>
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
											<TableCell>{record.filename}</TableCell>
											<TableCell>{record.mime_type}</TableCell>
											<TableCell>{getFileSize(record.file_length)}</TableCell>
											<TableCell className='inline-flex gap-2 items-center'>
												<DownloadButton id={record.id} />
												<DeleteButton id={record.id} />
											</TableCell>
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
