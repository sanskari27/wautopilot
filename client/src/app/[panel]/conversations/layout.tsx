import { ChatListExpandedProvider } from '@/components/context/chat-list-expanded';
import { ContactsProvider } from '@/components/context/contact';
import { MediaProvider } from '@/components/context/media';
import { QuickReplyProvider } from '@/components/context/quick-replies';
import { RecipientProvider } from '@/components/context/recipients';
import Loading from '@/components/elements/loading';
import ContactService from '@/services/contact.service';
import MediaService from '@/services/media.service';
import MessagesService from '@/services/messages.service';
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
	const conversations = await MessagesService.fetchAllConversation();
	const quickReplies = await MessagesService.fetchQuickReplies();
	const media = (await MediaService.getMedias())!;
	const contacts = (await ContactService.listContacts())!;

	return (
		<Suspense fallback={<Loading />}>
			<section>
				<MediaProvider data={media}>
					<ContactsProvider data={contacts}>
						<QuickReplyProvider data={quickReplies}>
							<RecipientProvider data={conversations}>
								<ChatListExpandedProvider>{children}</ChatListExpandedProvider>
							</RecipientProvider>
						</QuickReplyProvider>
					</ContactsProvider>
				</MediaProvider>
			</section>
		</Suspense>
	);
}
