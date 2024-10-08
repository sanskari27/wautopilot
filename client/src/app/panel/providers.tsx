'use client';

import { AgentProvider } from '@/components/context/agents';
import { ChatbotFlowProvider } from '@/components/context/chatbotFlows';
import { ChatbotProvider } from '@/components/context/chatbots';
import { ContactsProvider } from '@/components/context/contact';
import { MediaProvider } from '@/components/context/media';
import { FieldsContextProvider, TagsProvider } from '@/components/context/tags';
import { TemplatesProvider } from '@/components/context/templates';
import { UserDetailsProvider, UserDetailsType } from '@/components/context/user-details';
import { ChatBot } from '@/schema/chatbot';
import { Contact, ContactWithID } from '@/schema/phonebook';
import { TemplateWithID } from '@/schema/template';
import { Agent } from '@/types/agent';
import {  ChatbotFlow } from '@/types/chatbot';
import { Media } from '@/types/media';

export function Providers({
	children,
	userDetails,
	templates,
	chatBots,
	chatBotFlows,
	agents,
	labels,
	fields,
	media,
	contacts,
}: {
	children: React.ReactNode;
	userDetails: UserDetailsType;
	templates: TemplateWithID[];
	chatBots: ChatBot[];
	chatBotFlows: ChatbotFlow[];
	agents: Agent[];
	labels: string[];
	fields: {
		label: string;
		value: string;
	}[];
	media: Media[];
	contacts: ContactWithID[];
}) {
	return (
		<UserDetailsProvider data={userDetails}>
			<TagsProvider data={labels}>
				<MediaProvider data={media}>
					<ContactsProvider data={contacts}>
						<FieldsContextProvider data={fields}>
							<TemplatesProvider data={templates}>
								<AgentProvider data={agents}>
									<ChatbotProvider data={chatBots}>
										<ChatbotFlowProvider data={chatBotFlows}>
											{children}</ChatbotFlowProvider>
									</ChatbotProvider>
								</AgentProvider>
							</TemplatesProvider>
						</FieldsContextProvider>
					</ContactsProvider>
				</MediaProvider>
			</TagsProvider>
		</UserDetailsProvider>
	);
}
