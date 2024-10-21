import { Suspense } from 'react';
import Loading from '@/components/elements/loading';
import { MediaProvider } from '@/components/context/media';
import { WhatsappFlowProvider } from '@/components/context/whatsappFlows';
import { TemplatesProvider } from '@/components/context/templates';
import { ContactsProvider } from '@/components/context/contact';
import { QuickReplyProvider } from '@/components/context/quick-replies';
import { RecipientProvider } from '@/components/context/recipients';
import { MessagesProvider } from '@/components/context/message-store-provider';
import { ChatListExpandedProvider } from '@/components/context/chat-list-expanded';
import ChatBotService from '@/services/chatbot.service';
import ContactService from '@/services/contact.service';
import MediaService from '@/services/media.service';
import MessagesService from '@/services/messages.service';
import TemplateService from '@/services/template.service';
import UserService from '@/services/users.service';

const DataProvider = async ({ children }: { children: React.ReactNode }) => {
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
	);
};

export default DataProvider;
