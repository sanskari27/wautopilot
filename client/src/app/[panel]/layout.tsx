import Loading from '@/components/elements/loading';
import Navbar from '@/components/elements/Navbar';
import AuthService from '@/services/auth.service';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Providers } from './providers';

export const metadata: Metadata = {
	title: 'Dashboard • Wautopilot',
};

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const userDetails = (await AuthService.userDetails())!;

	return (
		<Suspense fallback={<Loading />}>
			<main className='w-full h-full '>
				<Navbar />
				<Providers userDetails={userDetails}>{children}</Providers>
			</main>
		</Suspense>
	);
}
