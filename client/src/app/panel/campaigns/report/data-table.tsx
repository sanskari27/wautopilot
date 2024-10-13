'use client';

import Each from '@/components/containers/each';
import Show from '@/components/containers/show';
import { usePermissions } from '@/components/context/user-details';
import DeleteDialog from '@/components/elements/dialogs/delete';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Table,
	TableBody,
	TableCell,
	TableCellLink,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import BroadcastService from '@/services/broadcast.service';
import { useRouter } from 'next/navigation';
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
		createdAt: string;
	}[];
}) {
	const permissions = usePermissions().broadcast;
	const router = useRouter();
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
			loading: 'Deleting Campaign...',
		});
	};

	return (
		<div>
			<div className='justify-between flex'>
				<h2 className='text-2xl font-bold'>Campaign Report</h2>
				<div className='flex gap-x-2 gap-y-1 flex-wrap '>
					<Show.ShowIf condition={permissions.export}>
						<Button onClick={handleExport} size={'sm'}>
							Export
						</Button>
					</Show.ShowIf>
					<Show.ShowIf condition={permissions.update}>
						<DeleteDialog onDelete={deleteCampaign}>
							<Button variant={'destructive'} size={'sm'}>
								Delete
							</Button>
						</DeleteDialog>
					</Show.ShowIf>
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
						<TableHead className='text-right text-destructive'>Failed</TableHead>
						<TableHead className='text-right'>Pending</TableHead>
						<TableHead className='text-center'>Status</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<Each
						items={list}
						render={(recurring) => {
							const link = `/panel/campaigns/button-report/${recurring.broadcast_id}`;
							return (
								<TableRow>
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
									<TableCellLink href={link} className='font-medium'>
										{recurring.name}
									</TableCellLink>
									<TableCellLink href={link} className='whitespace-pre-wrap'>
										{recurring.description}
									</TableCellLink>
									<TableCellLink href={link}>{recurring.createdAt}</TableCellLink>
									<TableCellLink href={link} className='text-right text-primary'>
										{recurring.sent}
									</TableCellLink>
									<TableCellLink href={link} className='text-right text-destructive'>
										{recurring.failed}
									</TableCellLink>
									<TableCellLink href={link} className='text-right'>
										{recurring.pending}
									</TableCellLink>
									<TableCell className='text-center'>
										<Show>
											<Show.When condition={permissions.update}>
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
											</Show.When>
											<Show.Else>
												{recurring.isPaused
													? 'Resume'
													: recurring.pending !== 0
													? 'Pause'
													: recurring.failed > 0
													? 'Resend Failed'
													: 'Completed'}
											</Show.Else>
										</Show>
									</TableCell>
								</TableRow>
							);
						}}
					/>
				</TableBody>
			</Table>
		</div>
	);
}
