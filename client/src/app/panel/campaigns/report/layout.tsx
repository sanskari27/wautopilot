import { BroadcastProvider } from '@/components/context/broadcast-report';
import Loading from '@/components/elements/loading';
import BroadcastService from '@/services/broadcast.service';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Campaign Report • Wautopilot',
};

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const list = await BroadcastService.broadcastReport();
	return (
		<Suspense fallback={<Loading />}>
			<BroadcastProvider data={list}>{children}</BroadcastProvider>
		</Suspense>
	);
}
