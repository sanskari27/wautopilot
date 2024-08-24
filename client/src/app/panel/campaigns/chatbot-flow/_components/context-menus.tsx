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

import { usePermissions } from '@/components/context/user-details';
import { ChatbotFlow } from '@/schema/chatbot-flow';
import ChatbotFlowService from '@/services/chatbot-flow.service';
import { Cog, Delete, Download, Edit, Settings2, ToggleLeft, ToggleRight } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { deleteChatbotFlow, toggleChatbotFlow } from '../action';

export function MainContextMenu({
	children,
	details,
}: {
	children: React.ReactNode;
	details: ChatbotFlow;
}) {
	const {
		chatbot_flow: permissions,
		buttons: { read: buttons_read },
	} = usePermissions();

	const toggleStatus = async () => {
		toast.promise(toggleChatbotFlow(details.id), {
			loading: 'Updating...',
			success: 'Updated successfully',
			error: 'Failed to update',
		});
	};

	const handleDelete = () => {
		toast.promise(deleteChatbotFlow(details.id), {
			loading: 'Deleting...',
			success: 'Deleted successfully',
			error: 'Failed to delete',
		});
	};

	const handleExportChatbotFlow = () => {
		toast.promise(ChatbotFlowService.exportChatbotFlow(details.id), {
			loading: 'Exporting...',
			success: 'Exported successfully',
			error: 'Failed to export',
		});
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<Show.ShowIf condition={permissions.update}>
					<Link
						href={`/panel/campaigns/chatbot-flow/${details.id}?data=${JSON.stringify(details)}`}
					>
						<DropdownMenuItem>
							<Edit className='mr-2 h-4 w-4' />
							<span>Edit Details</span>
						</DropdownMenuItem>
					</Link>

					<Link href={`/panel/campaigns/chatbot-flow/${details.id}/customize`}>
						<DropdownMenuItem>
							<Settings2 className='mr-2 h-4 w-4' />
							<span>Customize Flow</span>
						</DropdownMenuItem>
					</Link>
					<Show.ShowIf condition={details.isActive}>
						<DeleteDialog
							actionButtonText='Stop'
							message='Are you sure you want to stop this flow?'
							onDelete={toggleStatus}
						>
							<Button size={'sm'} variant={'ghost'} className='w-full p-2'>
								<ToggleLeft className='mr-2 h-4 w-4' />
								<span className='mr-auto'>Stop</span>
							</Button>
						</DeleteDialog>
					</Show.ShowIf>
					<Show.ShowIf condition={!details.isActive}>
						<DeleteDialog
							actionButtonText='Start'
							message='Are you sure you want to start this flow?'
							onDelete={toggleStatus}
						>
							<Button size={'sm'} variant={'ghost'} className='w-full p-2'>
								<ToggleRight className='mr-2 h-4 w-4' />
								<span className='mr-auto'>Start</span>
							</Button>
						</DeleteDialog>
					</Show.ShowIf>
				</Show.ShowIf>
				<Show.ShowIf condition={permissions.export}>
					<DropdownMenuItem onClick={handleExportChatbotFlow}>
						<Download className='mr-2 h-4 w-4' />
						<span>Export Chatbot</span>
					</DropdownMenuItem>
				</Show.ShowIf>
				<Show.ShowIf condition={buttons_read}>
					<Link href={`/panel/campaigns/button-report/${details.id}`}>
						<DropdownMenuItem>
							<Cog className='mr-2 h-4 w-4' />
							<span>Button Click Report</span>
						</DropdownMenuItem>
					</Link>
				</Show.ShowIf>
				<Show.ShowIf condition={permissions.delete}>
					<DeleteDialog onDelete={handleDelete}>
						<Button size={'sm'} variant={'destructive'} className='w-full p-2'>
							<Delete className='mr-2 h-4 w-4' />
							<span className='mr-auto'>Delete</span>
						</Button>
					</DeleteDialog>
				</Show.ShowIf>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
