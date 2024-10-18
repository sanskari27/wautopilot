import { ChatListExpandedProvider } from '@/components/context/chat-list-expanded';
import { ContactsProvider } from '@/components/context/contact';
import { MediaProvider } from '@/components/context/media';
import { MessagesProvider } from '@/components/context/message-store-provider';
import { QuickReplyProvider } from '@/components/context/quick-replies';
import { RecipientProvider } from '@/components/context/recipients';
import { TemplatesProvider } from '@/components/context/templates';
import { WhatsappFlowProvider } from '@/components/context/whatsappFlows';
import Loading from '@/components/elements/loading';
import ChatBotService from '@/services/chatbot.service';
import ContactService from '@/services/contact.service';
import MediaService from '@/services/media.service';
import MessagesService from '@/services/messages.service';
import TemplateService from '@/services/template.service';
import UserService from '@/services/users.service';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Conversations • Wautopilot',
};
export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [conversations, quickReplies, media, contacts, template, flow, message_tags] =
		await Promise.all([
			MessagesService.fetchAllConversation(),
			MessagesService.fetchQuickReplies(),
			MediaService.getMedias(),
			ContactService.listContacts(),
			TemplateService.listTemplates(),
			ChatBotService.listWhatsappFlows(),
			UserService.listMessageTags(),
		]);

	return (
		<Suspense fallback={<Loading />}>
			<section>
				<MediaProvider data={media}>
					<WhatsappFlowProvider data={flow as any}>
						<TemplatesProvider data={template}>
							<ContactsProvider data={contacts}>
								<QuickReplyProvider data={quickReplies}>
									<RecipientProvider data={conversations} message_tags={message_tags}>
										<MessagesProvider>
											<ChatListExpandedProvider>{children}</ChatListExpandedProvider>
										</MessagesProvider>
									</RecipientProvider>
								</QuickReplyProvider>
							</ContactsProvider>
						</TemplatesProvider>
					</WhatsappFlowProvider>
				</MediaProvider>
			</section>
		</Suspense>
	);
}
