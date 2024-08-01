import PageLayout from '@/components/containers/page-layout';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import '../globals.css';

const poppins = Poppins({ weight: ['400', '500', '600', '700', '800', '900'], subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Auth @ Wautopilot',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<link rel='shortcut icon' href='/favicon.ico' />
			<link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
			<link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
			<link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
			<body className={cn('h-screen w-screen overflow-x-hidden', poppins.className)}>
				<PageLayout>
					{children}
					<BackgroundBeams />
				</PageLayout>
				<Toaster position='top-center' />
			</body>
		</html>
	);
}
