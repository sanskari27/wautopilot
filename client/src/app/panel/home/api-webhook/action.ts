'use server';

import APIWebhookService from '@/services/apiwebhook.service';
import { revalidatePath } from 'next/cache';

export async function deleteApiKey(id: string) {
	await APIWebhookService.deleteApiKey(id);
	revalidatePath('/panel/hone/api-webhook', 'page');
}
