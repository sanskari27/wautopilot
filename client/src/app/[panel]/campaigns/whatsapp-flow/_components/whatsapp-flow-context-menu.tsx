'use client';

import DeleteDialog from '@/components/elements/dialogs/delete';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Cog, Delete, Edit } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { MdPublish } from 'react-icons/md';
import { deleteWhatsappFlow, publishWhatsappFlow } from '../action';

export default function WhatsappFlowContextMenu({
	children,
	id,
	details: { categories, name, status },
}: {
	children: React.ReactNode;
	id: string;
	details: {
		name: string;
		categories: string[];
		status: 'DRAFT' | 'PUBLISHED';
	};
}) {
	const params = useParams();
	const handlePublish = async () => {
		toast.promise(publishWhatsappFlow(id), {
			loading: 'Publishing...',
			success: 'Published successfully',
			error: 'Failed to publish',
		});
	};

	const handleDelete = () => {
		toast.promise(deleteWhatsappFlow(id), {
			loading: 'Deleting...',
			success: 'Deleted successfully',
			error: 'Failed to delete',
		});
	};

	if (status === 'PUBLISHED') {
		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
				<DropdownMenuContent className='w-56'>
					<Link href={`/${params.panel}/campaigns/whatsapp-flow/${id}/update-assets`}>
						<DropdownMenuItem>
							<Cog className='mr-2 h-4 w-4' />
							<span>View Flow Structure</span>
						</DropdownMenuItem>
					</Link>
				</DropdownMenuContent>
			</DropdownMenu>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DeleteDialog
					actionButton='Publish'
					message='Are you sure you want to publish this flow? Ones published, it cannot be edited.'
					onDelete={handlePublish}
				>
					<Button size={'sm'} variant={'ghost'} className='w-full p-2'>
						<MdPublish className='mr-2 h-4 w-4' />
						<span className='mr-auto'>Publish</span>
					</Button>
				</DeleteDialog>
				<Link
					href={`/${params.panel}/campaigns/whatsapp-flow?flow=edit&id=${id}&name=${name}&categories=${categories}`}
				>
					<DropdownMenuItem>
						<Edit className='mr-2 h-4 w-4' />
						<span>Edit Details</span>
					</DropdownMenuItem>
				</Link>
				<Link href={`/${params.panel}/campaigns/whatsapp-flow/${id}/update-assets?can_edit=true`}>
					<DropdownMenuItem>
						<Cog className='mr-2 h-4 w-4' />
						<span>Update Flow Structure</span>
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
