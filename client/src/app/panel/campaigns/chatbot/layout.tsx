import { ChatbotProvider } from '@/components/context/chatbots';
import { MediaProvider } from '@/components/context/media';
import { TemplatesProvider } from '@/components/context/templates';
import Loading from '@/components/elements/loading';
import ChatBotService from '@/services/chatbot.service';
import MediaService from '@/services/media.service';
import TemplateService from '@/services/template.service';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Broadcasts • Wautopilot',
};

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const chatbotList = (await ChatBotService.listChatBots())!;
	const medias = await MediaService.getMedias()!;

	const templateList = (await TemplateService.listTemplates())!;

	return (
		<Suspense fallback={<Loading />}>
			<section>
				<TemplatesProvider data={templateList}>
					<ChatbotProvider data={chatbotList}>
						<MediaProvider data={medias}>{children}</MediaProvider>
					</ChatbotProvider>
				</TemplatesProvider>
			</section>
		</Suspense>
	);
}
