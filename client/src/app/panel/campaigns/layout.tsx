import Loading from '@/components/elements/loading';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Campaigns • Wautopilot',
};

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {

	return (
		<Suspense fallback={<Loading />}>
			<section>
				{children}
			</section>
		</Suspense>
	);
}
