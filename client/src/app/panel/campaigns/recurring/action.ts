'use server';

import RecurringService from '@/services/recurring.service';
import { revalidatePath } from 'next/cache';

export async function toggleRecurring(campaignId: string) {
	const data = await RecurringService.toggleRecurring(campaignId);
	revalidatePath('/panel/campaigns/recurring', 'page');
	return data;
}

export async function deleteRecurring(campaignId: string) {
	await RecurringService.deleteRecurring(campaignId);
	revalidatePath('/panel/campaigns/recurring', 'page');
}
