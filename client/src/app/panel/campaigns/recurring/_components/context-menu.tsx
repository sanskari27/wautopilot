'use client';

import Show from '@/components/containers/show';
import { usePermissions } from '@/components/context/user-details';
import DeleteDialog from '@/components/elements/dialogs/delete';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Recurring } from '@/schema/broadcastSchema';
import RecurringService from '@/services/recurring.service';
import { Delete, Download, Edit, ToggleLeftIcon, ToggleRightIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { MdScheduleSend } from 'react-icons/md';
import { deleteRecurring, toggleRecurring } from '../action';

export default function RecurringActionContextMenu({
	children,
	campaignId,
	recurring,
	active,
}: {
	children: React.ReactNode;
	campaignId: string;
	recurring: Recurring;
	active: 'ACTIVE' | 'PAUSED';
}) {
	const router = useRouter();
	const permission = usePermissions().recurring;

	const rescheduleCampaign = () => {
		const promise = RecurringService.rescheduleRecurring(campaignId);

		toast.promise(promise, {
			loading: 'Rescheduling Campaign...',
			success: 'Campaign Rescheduled',
			error: 'Failed to Reschedule Campaign',
		});
	};

	const toggleRecurringCampaign = () => {
		const promise = toggleRecurring(campaignId);

		toast.promise(promise, {
			loading: 'Toggling Campaign...',
			success: (res) => {
				router.refresh();
				router.push(`/panel/campaigns/recurring`);
				return `Campaign ${res.status === 'ACTIVE' ? 'Paused' : 'Resumed'}`;
			},
			error: 'Failed to Toggle Campaign',
		});
	};

	const downloadRecurringCampaign = () => {
		const promise = RecurringService.downloadRecurring(campaignId);

		toast.promise(promise, {
			loading: 'Downloading Campaign...',
			success: 'Campaign Downloaded',
			error: 'Failed to Download Campaign',
		});
	};

	const deleteRecurringCampaign = () => {
		const promise = deleteRecurring(campaignId);

		toast.promise(promise, {
			loading: 'Deleting Campaign...',
			success: () => {
				router.refresh();
				return 'Campaign Deleted';
			},
			error: 'Failed to Delete Campaign',
		});
	};
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<Show.ShowIf condition={permission.update}>
					<Link href={`/panel/campaigns/recurring/${campaignId}?data=${JSON.stringify(recurring)}`}>
						<DropdownMenuItem>
							<Edit className='mr-2 h-4 w-4' />
							Edit
						</DropdownMenuItem>
					</Link>
					<DropdownMenuItem onClick={toggleRecurringCampaign}>
						<Show>
							<Show.When condition={active === 'ACTIVE'}>
								<ToggleLeftIcon className='mr-2 h-4 w-4' />
								<span>Pause</span>
							</Show.When>
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
				</Show.ShowIf>
				<Show.ShowIf condition={permission.export}>
					<DropdownMenuItem onClick={downloadRecurringCampaign}>
						<Download className='mr-2 h-4 w-4' />
						<span>Download</span>
					</DropdownMenuItem>
				</Show.ShowIf>
				<Show.ShowIf condition={permission.delete}>
					<DeleteDialog onDelete={deleteRecurringCampaign}>
						<Button size={'sm'} className='w-full bg-destructive hover:bg-destructive/50'>
							<Delete className='mr-2 h-4 w-4' />
							<span className='mr-auto'>Delete</span>
						</Button>
					</DeleteDialog>
				</Show.ShowIf>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
