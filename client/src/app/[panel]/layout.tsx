import PageLayout from '@/components/containers/page-layout';
import { AgentProvider } from '@/components/context/agents';
import { ContactsProvider } from '@/components/context/contact';
import { MediaProvider } from '@/components/context/media';
import { FieldsContextProvider, TagsProvider } from '@/components/context/tags';
import { UserDetailsProvider } from '@/components/context/user-details';
import DevicesDialog from '@/components/elements/dialogs/devices';
import Loading from '@/components/elements/loading';
import Navbar from '@/components/elements/Navbar';
import AgentService from '@/services/agent.service';
import AuthService from '@/services/auth.service';
import ContactService from '@/services/contact.service';
import MediaService from '@/services/media.service';
import PhoneBookService from '@/services/phonebook.service';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Dashboard • Wautopilot',
};

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const userDetails = (await AuthService.userDetails())!;
	const agents = (await AgentService.getAgents())!;
	const { labels, fields } = (await PhoneBookService.allLabels())!;
	const media = (await MediaService.getMedias())!;
	const contacts = (await ContactService.listContacts())!;

	return (
		<Suspense fallback={<Loading />}>
			<main className='w-full h-full '>
				<Navbar />
				<PageLayout className='overflow-scroll'>
					<UserDetailsProvider data={userDetails}>
						<TagsProvider data={labels}>
							<MediaProvider data={media}>
								<ContactsProvider data={contacts}>
									<FieldsContextProvider data={fields}>
										<AgentProvider data={agents}>{children}</AgentProvider>
									</FieldsContextProvider>
								</ContactsProvider>
							</MediaProvider>
						</TagsProvider>
					</UserDetailsProvider>
					<DevicesDialog />
				</PageLayout>
			</main>
		</Suspense>
	);
}
