'use client';

import DeleteDialog from '@/components/elements/dialogs/delete';
import { Button } from '@/components/ui/button';
import APIWebhookService from '@/services/apiwebhook.service';
import { CheckCheck, RefreshCcw, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { deleteApiKey, deleteWebhook } from '../action';

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
				<Trash className='w-4 h-4' />
			</Button>
		</DeleteDialog>
	);
}
export function DeleteWebhookButton({ id }: { id: string }) {
	const handleWebhookDelete = () => {
		const promise = deleteWebhook(id);

		toast.promise(promise, {
			loading: 'Deleting Webhook...',
			success: 'Webhook deleted successfully',
			error: 'Failed to delete Webhook',
		});
	};

	return (
		<DeleteDialog onDelete={handleWebhookDelete}>
			<Button variant={'destructive'} size={'icon'}>
				<Trash className='w-4 h-4' />
			</Button>
		</DeleteDialog>
	);
}

export function ValidateWebhook({ id }: { id: string }) {
	const validateWebhook = () => {
		const promise = APIWebhookService.validateWebhook(id);

		toast.promise(promise, {
			loading: 'Validating Webhook...',
			success: 'Webhook validated successfully',
			error: 'Failed to validate Webhook',
		});
	};

	return (
		<Button variant={'secondary'} size={'icon'} onClick={validateWebhook}>
			<CheckCheck className='w-4 h-4' />
		</Button>
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
			<RefreshCcw className='w-4 h-4' />
		</Button>
	);
}
