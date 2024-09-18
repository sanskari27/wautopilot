import { ContactsProvider } from '@/components/context/contact';
import { WhatsappFlowProvider } from '@/components/context/whatsappFlows';
import Loading from '@/components/elements/loading';
import ChatBotService from '@/services/chatbot.service';
import ContactService from '@/services/contact.service';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Customize Flow • Wautopilot',
};

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const chatBotFlows = (await ChatBotService.listWhatsappFlows())!;
	const contacts = (await ContactService.listContacts())!;

	return (
		<Suspense fallback={<Loading />}>
			<section>
				<ContactsProvider data={contacts}>
					<WhatsappFlowProvider data={chatBotFlows as any}>{children}</WhatsappFlowProvider>
				</ContactsProvider>
			</section>
		</Suspense>
	);
}
