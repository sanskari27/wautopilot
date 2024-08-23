import PageLayout from '@/components/containers/page-layout';
import Loading from '@/components/elements/loading';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const poppins = Poppins({ weight: ['400', '500', '600', '700', '800', '900'], subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Wautopilot',
	description: `Wautopilot provides businesses with advanced WhatsApp Business API solutions, enabling seamless bulk messaging, automated chatbots, and intuitive 2-way communication. Perfect for enhancing customer engagement, supporting multiple agents, and delivering personalized experiences at scale. Sign up today and revolutionize your business communication with Wautopilot.`,
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<link rel='shortcut icon' href='/icons/favicon.ico' />
			<link rel='apple-touch-icon' sizes='180x180' href='/icons/apple-touch-icon.png' />
			<link rel='icon' type='image/png' sizes='32x32' href='/icons/favicon-32x32.png' />
			<link rel='icon' type='image/png' sizes='16x16' href='/icons/favicon-16x16.png' />
			<body className={cn('h-screen w-screen overflow-x-hidden', poppins.className)}>
				<PageLayout>
					<Suspense fallback={<Loading />}>{children}</Suspense>
				</PageLayout>
				<Toaster position='top-center' />
			</body>
		</html>
	);
}
