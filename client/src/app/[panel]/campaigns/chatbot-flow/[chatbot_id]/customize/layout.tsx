import { WhatsappFlowProvider } from '@/components/context/whatsappFlows';
import Loading from '@/components/elements/loading';
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
	// const chatBotFlows = (await ChatBotService.listWhatsappFlows())!;

	const chatBotFlows = [
		{
			id: '997761165010054',
			name: 'NCLT Details clone',
			status: 'DRAFT',
			categories: ['SURVEY'],
		},
		{
			id: '818266007168015',
			name: 'test 4',
			status: 'DRAFT',
			categories: ['CONTACT_US'],
		},
		{
			id: '1140273103940962',
			name: 'sanskar_flow_servey',
			status: 'PUBLISHED',
			categories: ['OTHER'],
		},
		{
			id: '8290735010939251',
			name: 'VKimaya',
			status: 'PUBLISHED',
			categories: ['OTHER'],
		},
		{
			id: '2688188248029889',
			name: 'Multiselect Test',
			status: 'DRAFT',
			categories: ['OTHER'],
		},
		{
			id: '403472242162079',
			name: 'NCLT Details',
			status: 'PUBLISHED',
			categories: ['SURVEY'],
		},
		{
			id: '498804859199558',
			name: 'ticket_size',
			status: 'DRAFT',
			categories: ['OTHER'],
		},
		{
			id: '346280844538793',
			name: 'naukri_flow_two',
			status: 'PUBLISHED',
			categories: ['LEAD_GENERATION'],
		},
		{
			id: '1753473968472172',
			name: 'naukri_flow_one',
			status: 'PUBLISHED',
			categories: ['SIGN_IN'],
		},
		{
			id: '1052393509361492',
			name: 'bni_member_details',
			status: 'PUBLISHED',
			categories: ['SIGN_UP'],
		},
		{
			id: '1451113439172933',
			name: 'Sample_Flow',
			status: 'PUBLISHED',
			categories: ['SIGN_UP'],
		},
	];

	return (
		<Suspense fallback={<Loading />}>
			<section>
				<WhatsappFlowProvider data={chatBotFlows as any}>{children}</WhatsappFlowProvider>
			</section>
		</Suspense>
	);
}
