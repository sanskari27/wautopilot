'use server';

import ExtraService from '@/services/extra.service';
import { revalidatePath } from 'next/cache';

export async function createFAQs(list: { title: string; info: string }[]) {
	await ExtraService.createFAQs(list);
	revalidatePath('/[panel]/home/extras', 'page');
}

export async function createTestimonials(
	list: { title: string; name: string; photo_url: string; description: string }[]
) {
	await ExtraService.createTestimonials(list);
	revalidatePath('/[panel]/home/extras', 'page');
}
