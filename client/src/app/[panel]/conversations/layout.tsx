import { ChatListExpandedProvider } from '@/components/context/chat-list-expanded';
import { QuickReplyProvider } from '@/components/context/quick-replies';
import { RecipientProvider } from '@/components/context/recipients';
import Loading from '@/components/elements/loading';
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
	return (
		<Suspense fallback={<Loading />}>
			<section>
				<ChatListExpandedProvider>
					<QuickReplyProvider data={quickReplies}>
						<RecipientProvider data={conversations}>{children}</RecipientProvider>
					</QuickReplyProvider>
				</ChatListExpandedProvider>
			</section>
		</Suspense>
	);
}
