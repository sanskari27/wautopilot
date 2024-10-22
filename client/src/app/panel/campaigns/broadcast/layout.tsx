import { BroadcastProvider } from '@/components/context/broadcast-report';
import { MediaProvider } from '@/components/context/media';
import { TemplatesProvider } from '@/components/context/templates';
import Loading from '@/components/elements/loading';
import BroadcastService from '@/services/broadcast.service';
import MediaService from '@/services/media.service';
import TemplateService from '@/services/template.service';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Campaign • Wautopilot',
};

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const templates = (await TemplateService.listTemplates())!;
	const medias = await MediaService.getMedias()!;
	const list = await BroadcastService.broadcastReport();

	return (
		<Suspense fallback={<Loading />}>
			<section>
				<TemplatesProvider data={templates}>
					<MediaProvider data={medias}>
						<BroadcastProvider data={list}>{children}</BroadcastProvider>
					</MediaProvider>
				</TemplatesProvider>
			</section>
		</Suspense>
	);
}
