'use server';

import APIWebhookService from '@/services/apiwebhook.service';
import { revalidatePath } from 'next/cache';

export async function deleteApiKey(id: string) {
	await APIWebhookService.deleteApiKey(id);
	revalidatePath('/panel/hone/api-webhook', 'page');
}

export async function createWebhook(name: string, device: string, url: string) {
	await APIWebhookService.createWebhook(name, device, url);
	revalidatePath('/panel/home/api-webhook', 'page');
}

export async function deleteWebhook(id: string) {
	await APIWebhookService.deleteWebhook(id);
	revalidatePath('/panel/home/api-webhook', 'page');
}
