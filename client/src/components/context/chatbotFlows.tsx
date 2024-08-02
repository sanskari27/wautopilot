'use client';

import { ChatbotFlow } from '@/types/chatbot';
import * as React from 'react';

const ChatbotFlowContext = React.createContext<ChatbotFlow[]>([]);

export function ChatbotFlowProvider({
	children,
	data,
}: {
	children: React.ReactNode;
	data: ChatbotFlow[];
}) {
	return <ChatbotFlowContext.Provider value={data}>{children}</ChatbotFlowContext.Provider>;
}

export const useChatbotFlows = () => React.useContext(ChatbotFlowContext);
