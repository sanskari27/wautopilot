'use client';

import Show from '@/components/containers/show';
import DeleteDialog from '@/components/elements/dialogs/delete';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import RecurringService from '@/services/recurring.service';
import { Delete, Download, ToggleLeftIcon, ToggleRightIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { MdScheduleSend } from 'react-icons/md';

export default function RecurringActionContextMenu({
	children,
	CampaignId,
	active,
}: {
	children: React.ReactNode;
	CampaignId: string;
	active: 'ACTIVE' | 'PAUSED';
}) {
	const router = useRouter();
	const params = useParams();

	const rescheduleCampaign = () => {
		const promise = RecurringService.rescheduleRecurring(CampaignId);

		toast.promise(promise, {
			loading: 'Rescheduling Campaign...',
			success: 'Campaign Rescheduled',
			error: 'Failed to Reschedule Campaign',
		});
	};

	const toggleRecurringCampaign = () => {
		const promise = RecurringService.toggleRecurring(CampaignId);

		toast.promise(promise, {
			loading: 'Toggling Campaign...',
			success: (res) => {
				router.refresh();
				router.push(`/${params.panel}/campaigns/recurring`);
				return `Campaign ${res.status === 'ACTIVE' ? 'Paused' : 'Resumed'}`;
			},
			error: 'Failed to Toggle Campaign',
		});
	};

	const downloadRecurringCampaign = () => {
		const promise = RecurringService.downloadRecurring(CampaignId);

		toast.promise(promise, {
			loading: 'Downloading Campaign...',
			success: () => {
				router.refresh();
				router.push(`/${params.panel}/campaigns/recurring`);
				return 'Campaign Downloaded';
			},
			error: 'Failed to Download Campaign',
		});
	};

	const deleteRecurringCampaign = () => {
		const promise = RecurringService.deleteRecurring(CampaignId);

		toast.promise(promise, {
			loading: 'Deleting Campaign...',
			success: () => {
				router.push(`/${params.panel}/campaigns/recurring`);
				return 'Campaign Deleted';
			},
			error: 'Failed to Delete Campaign',
		});
	};
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuItem onClick={toggleRecurringCampaign}>
					<Show>
						<Show.ShowIf condition={active === 'ACTIVE'}>
							<ToggleLeftIcon className='mr-2 h-4 w-4' />
							<span>Pause</span>
						</Show.ShowIf>
						<Show.Else>
							<ToggleRightIcon className='mr-2 h-4 w-4' />
							<span>Resume</span>
						</Show.Else>
					</Show>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={rescheduleCampaign}>
					<MdScheduleSend className='mr-2 h-4 w-4' />
					<span>Reschedule</span>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={downloadRecurringCampaign}>
					<Download className='mr-2 h-4 w-4' />
					<span>Download</span>
				</DropdownMenuItem>
				<DeleteDialog onDelete={deleteRecurringCampaign}>
					<Button size={'sm'} className='w-full bg-destructive hover:bg-destructive/50'>
						<Delete className='mr-2 h-4 w-4' />
						<span className='mr-auto'>Delete</span>
					</Button>
				</DeleteDialog>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
