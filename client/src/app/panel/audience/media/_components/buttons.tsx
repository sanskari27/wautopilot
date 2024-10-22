'use client';
import { usePermissions } from '@/components/context/user-details';
import DeleteDialog from '@/components/elements/dialogs/delete';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import MediaService from '@/services/media.service';
import { FolderDown, Trash } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { UploadMedia } from './dialogs';

export function SwitchPreview() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const preview = searchParams.get('preview') === 'true';

	return (
		<Switch
			id='toggle-preview'
			checked={preview}
			onCheckedChange={(checked) => {
				const url = new URL((window as any).location);
				url.searchParams.set('preview', checked.toString());
				router.replace(url.toString());
			}}
		/>
	);
}

export function UploadButton() {
	const permission = usePermissions().media.create;
	if (!permission) return null;
	return <UploadMedia />;
}

export function DownloadButton({ id }: { id: string }) {
	function handleExport() {
		toast.promise(MediaService.downloadMedia(id), {
			success: 'Downloaded successfully',
			error: 'Failed to download',
			loading: 'Downloading...',
		});
	}

	return (
		<Button
			variant={'outline'}
			size={'icon'}
			className='border-primary w-8 h-8'
			onClick={handleExport}
		>
			<FolderDown className='w-4 h-4 text-primary' strokeWidth={2} />
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
		<DeleteDialog onDelete={handleExport} action='Media'>
			<Button variant={'outline'} size={'icon'} className='border-red-600 w-8 h-8'>
				<Trash className='w-4 h-4 text-red-600' strokeWidth={2} />
			</Button>
		</DeleteDialog>
	);
}
