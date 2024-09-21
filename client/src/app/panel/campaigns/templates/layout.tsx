import { TemplatesProvider } from '@/components/context/templates';
import Loading from '@/components/elements/loading';
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

	return (
		<Suspense fallback={<Loading />}>
			<section>
				<TemplatesProvider data={templates}>{children}</TemplatesProvider>
			</section>
		</Suspense>
	);
}
