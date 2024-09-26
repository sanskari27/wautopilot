import { ChatbotProvider } from '@/components/context/chatbots';
import { ContactsProvider } from '@/components/context/contact';
import { MediaProvider } from '@/components/context/media';
import { TemplatesProvider } from '@/components/context/templates';
import Loading from '@/components/elements/loading';
import ChatBotService from '@/services/chatbot.service';
import ContactService from '@/services/contact.service';
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
	const contacts = await ContactService.listContacts()!;

	const templateList = (await TemplateService.listTemplates())!;

	return (
		<Suspense fallback={<Loading />}>
			<section>
				<TemplatesProvider data={templateList}>
					<ChatbotProvider data={chatbotList}>
						<ContactsProvider data={contacts}>
							<MediaProvider data={medias}>{children}</MediaProvider>
						</ContactsProvider>
					</ChatbotProvider>
				</TemplatesProvider>
			</section>
		</Suspense>
	);
}
