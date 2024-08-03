'use client';

import { AgentProvider } from '@/components/context/agents';
import { ChatbotFlowProvider } from '@/components/context/chatbotFlows';
import { ChatbotProvider } from '@/components/context/chatbots';
import { FieldsContextProvider, TagsProvider } from '@/components/context/tags';
import { TemplatesProvider } from '@/components/context/templates';
import { UserDetailsProvider, UserDetailsType } from '@/components/context/user-details';
import { Agent } from '@/types/agent';
import { ChatBot, ChatbotFlow } from '@/types/chatbot';
import { Template } from '@/types/template';

export function Providers({
	children,
	userDetails,
	templates,
	chatBots,
	chatBotFlows,
	agents,
	labels,
	fields,
}: {
	children: React.ReactNode;
	userDetails: UserDetailsType;
	templates: Template[];
	chatBots: ChatBot[];
	chatBotFlows: ChatbotFlow[];
	agents: Agent[];
	labels: string[];
	fields: {
		label: string;
		value: string;
	}[];
}) {
	return (
		<UserDetailsProvider data={userDetails}>
			<TagsProvider data={labels}>
				<FieldsContextProvider data={fields}>
					<TemplatesProvider data={templates}>
						<ChatbotProvider data={chatBots}>
							<AgentProvider data={agents}>
								<ChatbotFlowProvider data={chatBotFlows}>{children}</ChatbotFlowProvider>
							</AgentProvider>
						</ChatbotProvider>
					</TemplatesProvider>
				</FieldsContextProvider>
			</TagsProvider>
		</UserDetailsProvider>
	);
}
