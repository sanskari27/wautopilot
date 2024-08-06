import Loading from '@/components/elements/loading';
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
	// const templates = (await TemplateService.listTemplates())!;
	// const chatBots = (await ChatBotService.listChatBots())!;
	// const chatBotFlows = (await ChatbotFlowService.listChatBots())!;
	// console.log('fetching templates, chatBots, chatBotFlows');

	return (
		<Suspense fallback={<Loading />}>
			<section>
				{children}
				{/* <TemplatesProvider data={templates}>
					<ChatbotProvider data={chatBots}>
						<ChatbotFlowProvider data={chatBotFlows}>
							</ChatbotFlowProvider>
					</ChatbotProvider>
					<DevicesDialog />
				</TemplatesProvider> */}
			</section>
		</Suspense>
	);
}
