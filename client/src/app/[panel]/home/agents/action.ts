'use server';

import AgentService from '@/services/agent.service';
import AuthService from '@/services/auth.service';
import { revalidatePath } from 'next/cache';
import { redirect, RedirectType } from 'next/navigation';

export async function switchServiceAccount(id: string) {
	const status = await AuthService.serviceAccount(id);
	if (status) {
		redirect('/agent/home/dashboard', RedirectType.replace);
	}
}

export async function deleteAgent(id: string) {
	try {
		await AgentService.deleteAgent(id);
		revalidatePath('[panel]/home/agents', 'page');
	} catch (e) {}
}

export async function assignConversationsToAgent(id: string, numbers: string[]) {
	await AgentService.assignConversationsToAgent(id, { numbers });
}
