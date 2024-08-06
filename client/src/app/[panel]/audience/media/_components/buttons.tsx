'use client';
import DeleteDialog from '@/components/elements/dialogs/delete';
import { Button } from '@/components/ui/button';
import MediaService from '@/services/media.service';
import { FolderDown, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export function DownloadButton({ id }: { id: string }) {
	function handleExport() {
		toast.promise(MediaService.downloadMedia(id), {
			success: 'Downloaded successfully',
			error: 'Failed to download',
			loading: 'Downloading...',
		});
	}

	return (
		<Button variant={'outline'} size={'icon'} className='border-primary' onClick={handleExport}>
			<FolderDown className='w-5 h-5 text-primary' strokeWidth={2} />
		</Button>
	);
}

export function DeleteButton({ id }: { id: string }) {
	const router = useRouter();
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

	return (
		<DeleteDialog onDelete={handleExport}>
			<Button variant={'outline'} size={'icon'} className='border-red-600'>
				<Trash className='w-5 h-5 text-red-600' strokeWidth={2} />
			</Button>
		</DeleteDialog>
	);
}
