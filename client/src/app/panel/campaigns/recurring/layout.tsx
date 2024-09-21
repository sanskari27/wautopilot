import { MediaProvider } from '@/components/context/media';
import { TemplatesProvider } from '@/components/context/templates';
import Loading from '@/components/elements/loading';
import MediaService from '@/services/media.service';
import TemplateService from '@/services/template.service';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Broadcasts • Wautopilot',
};

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const templates = (await TemplateService.listTemplates())!;
	const medias = (await MediaService.getMedias())!;

	return (
		<Suspense fallback={<Loading />}>
			<section>
				<TemplatesProvider data={templates}>
					<MediaProvider data={medias}>{children}</MediaProvider>
				</TemplatesProvider>
			</section>
		</Suspense>
	);
}
