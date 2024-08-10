'use server';

import ChatBotService from '@/services/chatbot.service';
import { revalidatePath } from 'next/cache';
import { RedirectType, redirect } from 'next/navigation';

export async function createWhatsappFlow(details: {
	name: string;
	categories: (
		| 'SIGN_UP'
		| 'SIGN_IN'
		| 'APPOINTMENT_BOOKING'
		| 'LEAD_GENERATION'
		| 'CONTACT_US'
		| 'CUSTOMER_SUPPORT'
		| 'SURVEY'
		| 'OTHER'
	)[];
}) {
	const id = await ChatBotService.createWhatsappFlow(details);
	redirect(`[panel]/campaigns/whatsapp-flow/${id}`, RedirectType.push);
}

export async function updateWhatsappFlow(
	flowId: string,
	details: {
		name: string;
		categories: (
			| 'SIGN_UP'
			| 'SIGN_IN'
			| 'APPOINTMENT_BOOKING'
			| 'LEAD_GENERATION'
			| 'CONTACT_US'
			| 'CUSTOMER_SUPPORT'
			| 'SURVEY'
			| 'OTHER'
		)[];
	}
) {
	await ChatBotService.updateWhatsappFlow(flowId, details);
	revalidatePath('[panel]/campaigns/whatsapp-flow', 'page');
}

export async function publishWhatsappFlow(id: string) {
	const success = await ChatBotService.publishWhatsappFlow(id);
	if (success) {
		revalidatePath('[panel]/campaigns/whatsapp-flow', 'page');
	}
	console.log('publishWhatsappFlow');
}

export async function deleteWhatsappFlow(id: string) {
	const success = await ChatBotService.deleteWhatsappFlow(id);
	if (success) {
		revalidatePath('[panel]/campaigns/whatsapp-flow', 'page');
	}
}
