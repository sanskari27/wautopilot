'use client';

import DeleteDialog from '@/components/elements/dialogs/delete';
import { Button } from '@/components/ui/button';
import APIWebhookService from '@/services/apiwebhook.service';
import { RefreshCcw, Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import { deleteApiKey } from '../action';
import { useRouter } from 'next/navigation';

export function DeleteAPIKey({ id }: { id: string }) {
	const deleteAPIKey = () => {
		const promise = deleteApiKey(id);

		toast.promise(promise, {
			loading: 'Deleting API Key...',
			success: 'API Key deleted successfully',
			error: 'Failed to delete API Key',
		});
	};

	return (
		<DeleteDialog onDelete={deleteAPIKey}>
			<Button variant={'destructive'} size={'icon'}>
				<Trash />
			</Button>
		</DeleteDialog>
	);
}

export function RegenerateAPIKey({ id }: { id: string }) {
	const router = useRouter();
	const regenerateAPIKey = () => {
		const promise = APIWebhookService.RegenerateAPIKey(id);

		toast.promise(promise, {
			loading: 'Regenerating API Key...',
			success: (token) => {
				const url = new URL((window as any).location);
				url.searchParams.set('token', token);
				router.replace(url.toString());
				return 'API Key regenerated successfully';
			},
			error: 'Failed to regenerate API Key',
		});
	};

	return (
		<Button variant={'secondary'} size={'icon'} onClick={regenerateAPIKey}>
			<RefreshCcw />
		</Button>
	);
}
