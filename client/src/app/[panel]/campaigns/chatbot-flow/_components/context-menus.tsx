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
import { ChatbotFlow } from '@/types/chatbot';
import { Cog, Delete, Edit, Settings2, ToggleLeft, ToggleRight } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { deleteChatbotFlow, toggleChatbotFlow } from '../action';

export function MainContextMenu({
	children,
	details,
}: {
	children: React.ReactNode;
	details: ChatbotFlow;
}) {
	const params = useParams();
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

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<Link href={`/${params.panel}/campaigns/chatbot-flow/${details.id}/details`}>
					<DropdownMenuItem>
						<Edit className='mr-2 h-4 w-4' />
						<span>Edit Details</span>
					</DropdownMenuItem>
				</Link>
				<Link href={`/${params.panel}/campaigns/chatbot-flow/${details.id}/customize`}>
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
				<Link href={`/${params.panel}/campaigns/button-report/${details.id}`}>
					<DropdownMenuItem>
						<Cog className='mr-2 h-4 w-4' />
						<span>Button Click Report</span>
					</DropdownMenuItem>
				</Link>
				<DeleteDialog onDelete={handleDelete}>
					<Button size={'sm'} variant={'destructive'} className='w-full p-2'>
						<Delete className='mr-2 h-4 w-4' />
						<span className='mr-auto'>Delete</span>
					</Button>
				</DeleteDialog>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
