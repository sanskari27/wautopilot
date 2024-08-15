'use client';
import { usePermissions } from '@/components/context/user-details';
import { Button } from '@/components/ui/button';
import BroadcastService from '@/services/broadcast.service';
import { FolderDown } from 'lucide-react';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';

export function ExportButton() {
	const id = useParams().campaignId as string;
	const permission = usePermissions().buttons.export;
	const handleExport = () => {
		if (!id || !permission) return;
		toast.promise(
			BroadcastService.buttonResponseReport({
				campaignId: id,
				exportCSV: true,
			}),
			{
				loading: 'Downloading...',
				success: 'Report downloaded successfully!',
				error: 'Unable to download!',
			}
		);
	};

	if (!permission) return null;

	return (
		<Button size={'sm'} className='bg-teal-600 hover:bg-teal-700' onClick={handleExport}>
			<FolderDown className='w-4 h-4 mr-2' />
			Export
		</Button>
	);
}
