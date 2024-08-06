import { ChatbotFlowProvider } from '@/components/context/chatbotFlows';
import { ChatbotProvider } from '@/components/context/chatbots';
import { TemplatesProvider } from '@/components/context/templates';
import DevicesDialog from '@/components/elements/dialogs/devices';
import Loading from '@/components/elements/loading';
import ChatbotFlowService from '@/services/chatbot-flow.service';
import ChatBotService from '@/services/chatbot.service';
import TemplateService from '@/services/template.service';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Campaigns • Wautopilot',
};

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const templates = (await TemplateService.listTemplates())!;
	const chatBots = (await ChatBotService.listChatBots())!;
	const chatBotFlows = (await ChatbotFlowService.listChatBots())!;
	console.log('fetching templates, chatBots, chatBotFlows');

	return (
		<Suspense fallback={<Loading />}>
			<section>
				<TemplatesProvider data={templates}>
					<ChatbotProvider data={chatBots}>
						<ChatbotFlowProvider data={chatBotFlows}>{children}</ChatbotFlowProvider>
					</ChatbotProvider>
					<DevicesDialog />
				</TemplatesProvider>
			</section>
		</Suspense>
	);
}
