import PageLayout from '@/components/containers/page-layout';
import Loading from '@/components/elements/loading';
import Navbar from '@/components/elements/Navbar';
import AgentService from '@/services/agent.service';
import AuthService from '@/services/auth.service';
import ChatbotFlowService from '@/services/chatbot-flow.service';
import ChatBotService from '@/services/chatbot.service';
import TemplateService from '@/services/template.service';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Providers } from './providers';

export const metadata: Metadata = {
	title: 'Dashboard • Wautopilot',
};

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const userDetails = (await AuthService.userDetails())!;
	const templates = (await TemplateService.listTemplates())!;
	const chatBots = (await ChatBotService.listChatBots())!;
	const chatBotFlows = (await ChatbotFlowService.listChatBots())!;
	const agents = (await AgentService.getAgents())!;

	return (
		<Suspense fallback={<Loading />}>
			<main className='w-full h-full '>
				<Navbar />
				<PageLayout className='mt-[60px]'>
					<Providers
						userDetails={userDetails}
						templates={templates}
						chatBots={chatBots}
						chatBotFlows={chatBotFlows}
						agents={agents}
					>
						{children}
					</Providers>
				</PageLayout>
			</main>
		</Suspense>
	);
}
