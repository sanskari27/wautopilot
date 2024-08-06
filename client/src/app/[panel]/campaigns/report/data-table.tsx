'use client';

import Each from '@/components/containers/each';
import { RowButton } from '@/components/containers/row-button';
import DeleteDialog from '@/components/elements/dialogs/delete';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import BroadcastService from '@/services/broadcast.service';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';

export default function ReportDataTable({
	list,
}: {
	list: {
		broadcast_id: string;
		name: string;
		description: string;
		template_name: string;
		status: 'ACTIVE' | 'PAUSED';
		sent: number;
		failed: number;
		pending: number;
		isPaused: boolean;
		create_at: string;
	}[];
}) {
	const router = useRouter();
	const params = useParams();
	const panel = params.panel as string;
	const [selectedBroadcast, setSelectedBroadcast] = React.useState<string[]>([]);

	const removeCampaignList = (campaign_id: string) => {
		setSelectedBroadcast((prev) => prev.filter((campaign) => campaign !== campaign_id));
	};

	const addCampaignList = (id: string) => {
		setSelectedBroadcast((prev) => [...prev, id]);
	};

	const handleExport = () => {
		if (selectedBroadcast.length === 0) {
			toast.error('Please select at least one broadcast to download');
			return;
		}
		const promises = selectedBroadcast.map(async (id) => BroadcastService.downloadBroadcast(id));
		toast.promise(Promise.all(promises), {
			success: 'Downloaded successfully',
			error: 'Failed to download broadcast report',
			loading: 'Downloading...',
		});
	};

	const deleteCampaign = async () => {
		const promises = selectedBroadcast.map(async (campaign) => {
			await BroadcastService.deleteBroadcast(campaign);
		});
		toast.promise(Promise.all(promises), {
			success: () => {
				setSelectedBroadcast([]);
				router.refresh();
				return 'Campaign deleted successfully';
			},
			error: 'Failed to delete campaign',
			loading: 'Deleting campaign...',
		});
	};

	return (
		<div>
			<div className='justify-between flex'>
				<h2 className='text-2xl font-bold'>Campaign Report</h2>
				<div className='flex gap-x-2 gap-y-1 flex-wrap '>
					<Button onClick={handleExport} size={'sm'}>
						Export
					</Button>
					<DeleteDialog onDelete={deleteCampaign}>
						<Button variant={'destructive'} size={'sm'}>
							Delete
						</Button>
					</DeleteDialog>
				</div>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>
							<Checkbox
								checked={
									selectedBroadcast.length === list.length
										? true
										: selectedBroadcast.length === 0
										? false
										: 'indeterminate'
								}
								onCheckedChange={(checked) => {
									if (checked) {
										setSelectedBroadcast(list.map((broadcast) => broadcast.broadcast_id));
									} else {
										setSelectedBroadcast([]);
									}
								}}
							/>
						</TableHead>
						<TableHead>Name</TableHead>
						<TableHead>Description</TableHead>
						<TableHead>Created At</TableHead>
						<TableHead className='text-right text-primary'>Sent</TableHead>
						<TableHead className='text-right text-destructive'>Pending</TableHead>
						<TableHead className='text-right'>Failed</TableHead>
						<TableHead className='text-center'>Status</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<Each
						items={list}
						render={(recurring) => {
							return (
								<RowButton
									href={`
                                    /${panel}/campaigns/report/button-report/${recurring.broadcast_id}
                                `}
								>
									<TableCell className='font-medium'>
										<Checkbox
											checked={selectedBroadcast.includes(recurring.broadcast_id)}
											onCheckedChange={(checked) => {
												if (checked) {
													addCampaignList(recurring.broadcast_id);
												} else {
													removeCampaignList(recurring.broadcast_id);
												}
											}}
										/>
									</TableCell>
									<TableCell className='font-medium'>{recurring.name}</TableCell>
									<TableCell className='whitespace-pre-wrap'>{recurring.description}</TableCell>
									<TableCell>{recurring.create_at}</TableCell>
									<TableCell className='text-right text-primary'>{recurring.sent}</TableCell>
									<TableCell className='text-right text-destructive'>{recurring.failed}</TableCell>
									<TableCell className='text-right'>{recurring.pending}</TableCell>
									<TableCell className='text-center'>
										{recurring.isPaused ? (
											<Button
												size={'sm'}
												onClick={() => {
													BroadcastService.resumeBroadcast(recurring.broadcast_id).then(() => {
														router.refresh();
													});
												}}
											>
												Resume
											</Button>
										) : recurring.pending !== 0 ? (
											<Button
												size={'sm'}
												variant={'destructive'}
												onClick={() => {
													BroadcastService.pauseBroadcast(recurring.broadcast_id).then(() => {
														router.refresh();
													});
												}}
											>
												Pause
											</Button>
										) : recurring.failed > 0 ? (
											<Button
												size={'sm'}
												variant={'outline'}
												onClick={() => {
													BroadcastService.resendFailedBroadcast(recurring.broadcast_id).then(
														() => {
															router.refresh();
														}
													);
												}}
											>
												Resend Failed
											</Button>
										) : (
											'Completed'
										)}
									</TableCell>
								</RowButton>
							);
						}}
					/>
				</TableBody>
			</Table>
		</div>
	);
}
