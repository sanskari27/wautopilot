'use client';
import { usePermissions } from '@/components/context/user-details';
import DeleteDialog from '@/components/elements/dialogs/delete';
import { Button } from '@/components/ui/button';
import MediaService from '@/services/media.service';
import { LayoutPanelTop, Trash } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export function AddTemplate() {
	const params = useParams();
	return (
		<Link href={`/${params.panel}/campaigns/templates/create`}>
			<Button size={'sm'} variant={'outline'} className='border-primary text-primary'>
				<LayoutPanelTop className='w-4 h-4 mr-2' />
				Add Template
			</Button>
		</Link>
	);
}

export function DeleteButton({ id }: { id: string }) {
	const router = useRouter();
	const permission = usePermissions().template.delete;
	function handleExport() {
		toast.promise(MediaService.deleteMedia(id), {
			success: () => {
				router.refresh();
				return 'Deleted successfully';
			},
			error: 'Failed to delete',
			loading: 'Deleting...',
		});
	}

	if (!permission) return null;

	return (
		<DeleteDialog onDelete={handleExport}>
			<Button size={'icon'} className='bg-red-600 hover:bg-red-700'>
				<Trash className='w-5 h-5' strokeWidth={2} />
			</Button>
		</DeleteDialog>
	);
}
