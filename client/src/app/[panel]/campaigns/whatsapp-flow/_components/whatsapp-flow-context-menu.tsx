'use client';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { MdPublish } from 'react-icons/md';
import { publishWhatsappFlow } from '../action';

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

	if (status === 'PUBLISHED') {
		return null;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuItem onClick={handlePublish}>
					<MdPublish className='mr-2 h-4 w-4' />
					<span>Publish</span>
				</DropdownMenuItem>
				<Link
					href={`/${params.panel}/campaigns/whatsapp-flow?flow=edit&id=${id}&name=${name}&categories=${categories}`}
				>
					<DropdownMenuItem>
						<Edit className='mr-2 h-4 w-4' />
						<span>Edit</span>
					</DropdownMenuItem>
				</Link>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
