import PageLayout from '@/components/containers/page-layout';
import { AgentProvider } from '@/components/context/agents';
import { FieldsContextProvider, TagsProvider } from '@/components/context/tags';
import { UserDetailsProvider } from '@/components/context/user-details';
import DevicesDialog from '@/components/elements/dialogs/devices';
import SettingsDialog from '@/components/elements/dialogs/settings';
import Loading from '@/components/elements/loading';
import Navbar from '@/components/elements/Navbar';
import AgentService from '@/services/agent.service';
import AuthService from '@/services/auth.service';
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

	return (
		<Suspense fallback={<Loading />}>
			<main className='w-full h-full '>
				<Navbar />
				<PageLayout className='overflow-scroll'>
					<UserDetailsProvider data={userDetails}>
						<TagsProvider data={labels}>
							<FieldsContextProvider data={fields}>
								<AgentProvider data={agents}>{children}</AgentProvider>
								<SettingsDialog />
							</FieldsContextProvider>
						</TagsProvider>
					</UserDetailsProvider>
					<DevicesDialog />
				</PageLayout>
			</main>
		</Suspense>
	);
}
