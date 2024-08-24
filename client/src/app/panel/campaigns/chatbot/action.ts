'use server'

import ChatBotService from "@/services/chatbot.service";
import { revalidatePath } from "next/cache";

export async function toggleChatbot(botId: string) {
    const res = await ChatBotService.toggleBot(botId);
    revalidatePath('[panel]/campaigns/chatbot', 'page');
    return res;
}

export async function deleteChatbot(botId: string) {
    const res = await ChatBotService.deleteBot(botId);
    revalidatePath('[panel]/campaigns/chatbot', 'page');
    return res;
}