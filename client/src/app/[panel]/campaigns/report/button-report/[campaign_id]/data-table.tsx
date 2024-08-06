'use client';

import Each from '@/components/containers/each';
import Show from '@/components/containers/show';
import { Button } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import BroadcastService from '@/services/broadcast.service';
import toast from 'react-hot-toast';

export default function ResponseDataTable({
	list,
	id,
}: {
	id: string;
	list: {
		button_text: string;
		recipient: string;
		responseAt: string;
		name: string;
		email: string;
	}[];
}) {
	const handleExport = () => {
		if (!id) return;
		toast.promise(
			BroadcastService.buttonResponseReport({
				campaignId:id,
				exportCSV: true,
			}),
			{
				loading: 'Downloading...',
				success: 'Report downloaded successfully!',
				error: 'Unable to download!',
			}
		);
	};

	return (
		<div>
			<div className='justify-between flex'>
				<h2 className='text-2xl font-bold'>Button Response</h2>
				<div className='flex gap-x-2 gap-y-1 flex-wrap '>
					<Button onClick={handleExport} size={'sm'}>
						Export
					</Button>
				</div>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>S/N</TableHead>
						<TableHead>Name</TableHead>
						<TableHead>Email</TableHead>
						<TableHead className='text-right'>Phone No</TableHead>
						<TableHead>Button Text</TableHead>
						<TableHead>Clicked At</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<Show>
						<Show.When condition={list.length === 0}>
							<TableRow>
								<TableCell colSpan={6} className='text-center'>
									No data available
								</TableCell>
							</TableRow>
						</Show.When>
					</Show>
					<Each
						items={list}
						render={(report, index) => {
							return (
								<TableRow>
									<TableCell className='font-medium'>{index + 1}</TableCell>
									<TableCell className='font-medium'>{report.name}</TableCell>
									<TableCell>{report.email}</TableCell>
									<TableCell className='text-right'>{report.recipient}</TableCell>
									<TableCell>{report.button_text}</TableCell>
									<TableCell>{report.responseAt}</TableCell>
								</TableRow>
							);
						}}
					/>
				</TableBody>
			</Table>
		</div>
	);
}
