import PageLayout from '@/components/containers/page-layout';
import DevicesDialog from '@/components/elements/dialogs/devices';
import Loading from '@/components/elements/loading';
import Navbar from '@/components/elements/Navbar';
import AgentService from '@/services/agent.service';
import AuthService from '@/services/auth.service';
import ChatbotFlowService from '@/services/chatbot-flow.service';
import ChatBotService from '@/services/chatbot.service';
import ContactService from '@/services/contact.service';
import MediaService from '@/services/media.service';
import PhoneBookService from '@/services/phonebook.service';
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
	const { labels, fields } = (await PhoneBookService.allLabels())!;
	const media = (await MediaService.getMedias())!;
	const contacts = (await ContactService.listContacts())!;

	return (
		<Suspense fallback={<Loading />}>
			<main className='w-full h-full '>
				<Navbar />
				<PageLayout className='overflow-scroll'>
					<Providers
						{...{
							userDetails,
							templates,
							chatBots,
							chatBotFlows,
							agents,
							labels,
							fields,
							media,
							contacts,
						}}
					>
						{children}
						<DevicesDialog />
					</Providers>
				</PageLayout>
			</main>
		</Suspense>
	);
}
