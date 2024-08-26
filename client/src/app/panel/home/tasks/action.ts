'use server';

import AgentService from '@/services/agent.service';
import { revalidatePath } from 'next/cache';

export async function AssignTask(
	text: string,
	due_date: string,
	selectedAgent: string | undefined
) {
	await AgentService.assignTask(text, due_date, selectedAgent);
	revalidatePath('panel/home/tasks', 'page');
}
