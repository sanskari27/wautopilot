import { ContactsProvider } from '@/components/context/contact';
import { MediaProvider } from '@/components/context/media';
import { TemplatesProvider } from '@/components/context/templates';
import Loading from '@/components/elements/loading';
import ContactService from '@/services/contact.service';
import MediaService from '@/services/media.service';
import TemplateService from '@/services/template.service';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Chatbot Flow • Wautopilot',
};

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const medias = await MediaService.getMedias()!;
	const contacts = await ContactService.listContacts()!;

	const templateList = (await TemplateService.listTemplates())!;
	return (
		<Suspense fallback={<Loading />}>
			<section>
				<TemplatesProvider data={templateList}>
					<ContactsProvider data={contacts}>
						<MediaProvider data={medias}>{children}</MediaProvider>
					</ContactsProvider>
				</TemplatesProvider>
			</section>
		</Suspense>
	);
}
