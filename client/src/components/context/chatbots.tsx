'use client';

import { ChatBot } from '@/schema/chatbot';
import * as React from 'react';

const ChatbotContext = React.createContext<ChatBot[]>([]);

export function ChatbotProvider({
	children,
	data,
}: {
	children: React.ReactNode;
	data: ChatBot[];
}) {
	return <ChatbotContext.Provider value={data}>{children}</ChatbotContext.Provider>;
}

export const useChatbots = () => React.useContext(ChatbotContext);
