import PageLayout from '@/components/containers/page-layout';
import { AgentProvider } from '@/components/context/agents';
import { DeviceAlertProvider } from '@/components/context/device-alert';
import { DevicesStateProvider } from '@/components/context/devicesState';
import { SettingStateProvider } from '@/components/context/settingState';
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
import DevicesAlertDialog from '../../components/elements/dialogs/devices-alert';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
	title: 'Dashboard • Wautopilot',
};

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [userDetails, agents, { labels, fields }] = await Promise.all([
		AuthService.userDetails(),
		AgentService.getAgents(),
		PhoneBookService.allLabels(),
	]);

	return (
		<Suspense fallback={<Loading />}>
			<main className='w-full h-full '>
				<SettingStateProvider>
					<UserDetailsProvider data={userDetails!}>
						<DevicesStateProvider>
							<DeviceAlertProvider data={userDetails?.no_of_devices!}>
								<DevicesAlertDialog />
								<Navbar />
								<PageLayout className='overflow-scroll'>
									<TagsProvider data={labels}>
										<FieldsContextProvider data={fields}>
											<AgentProvider data={agents}>{children}</AgentProvider>
											<SettingsDialog />
										</FieldsContextProvider>
									</TagsProvider>
									<DevicesDialog />
								</PageLayout>
							</DeviceAlertProvider>
						</DevicesStateProvider>
					</UserDetailsProvider>
				</SettingStateProvider>
			</main>
		</Suspense>
	);
}
