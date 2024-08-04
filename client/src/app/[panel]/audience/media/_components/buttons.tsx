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
		<Button size={'icon'} className='bg-teal-600 hover:bg-teal-700' onClick={handleExport}>
			<FolderDown className='w-5 h-5' strokeWidth={2} />
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
			<Button size={'icon'} className='bg-red-600 hover:bg-red-700'>
				<Trash className='w-5 h-5' strokeWidth={2} />
			</Button>
		</DeleteDialog>
	);
}
