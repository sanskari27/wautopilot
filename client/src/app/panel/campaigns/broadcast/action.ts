'use server';

import api from '@/lib/api';
import { Broadcast } from '@/schema/broadcastSchema';
import { revalidatePath } from 'next/cache';

export const ScheduleBroadcast = async (
	data: Broadcast & {
		forceSchedule?: boolean;
	}
) => {
	await api.post(`/broadcast/send`, {
		name: data.name,
		description: data.description,
		template_id: data.template_id,
		template_name: data.template_name,
		to: data.recipients_from === 'numbers' ? data.to : [],
		labels: data.recipients_from === 'tags' ? data.labels : [],
		broadcast_options: data.broadcast_options,
		...(data.body && { body: data.body }),
		...(data.carousel && { carousel: data.carousel }),
		...(data.buttons && { buttons: data.buttons }),
		...(data.header && data.header.type !== 'NONE' && { header: data.header }),
		forceSchedule: data.forceSchedule || false,
	});

	revalidatePath('/panel/campaigns/report', 'page');
};
