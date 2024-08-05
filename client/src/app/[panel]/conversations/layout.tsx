import { RecipientProvider } from '@/components/context/recipients';
import Loading from '@/components/elements/loading';
import MessagesService from '@/services/messages.service';
import { Metadata } from 'next';
import { Suspense } from 'react';
import RecipientsList from './_components/recipientsList';

export const metadata: Metadata = {
	title: 'Conversations • Wautopilot',
};

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const conversations = await MessagesService.fetchAllConversation();

	return (
		<Suspense fallback={<Loading />}>
			<section>
				<RecipientProvider data={conversations}>
					{children}
				</RecipientProvider>
			</section>
		</Suspense>
	);
}
