'use server';

import ChatBotService from '@/services/chatbot.service';
import { revalidatePath } from 'next/cache';

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
	const success = await ChatBotService.updateWhatsappFlow(flowId, details);
	if (success) {
		revalidatePath('[panel]/campaigns/whatsapp-flow', 'page');
	}
}

export async function publishWhatsappFlow(id: string) {
	
	const success = await ChatBotService.publishWhatsappFlow(id);
	if (success) {
		revalidatePath('[panel]/campaigns/whatsapp-flow', 'page');
	}
}
