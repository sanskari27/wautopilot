'use server';

import ChatbotFlowService from '@/services/chatbot-flow.service';
import { revalidatePath } from 'next/cache';

export async function toggleChatbotFlow(id: string) {
	await ChatbotFlowService.toggleChatbotFlow(id);
	revalidatePath('[panel]/campaigns/chatbot-flow', 'page');
}

export async function deleteChatbotFlow(id: string) {
	await ChatbotFlowService.deleteChatbotFlow(id);
	revalidatePath('[panel]/campaigns/chatbot-flow', 'page');
}

export async function updateNodesAndEdges(id: string, details: { nodes: any[]; edges: any[] }) {
	await ChatbotFlowService.updateNodesAndEdges(id, details);
}
