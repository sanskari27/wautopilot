import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const dm_sans = DM_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: '',
	description: '....',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<head>
				<link rel='shortcut icon' href='/icons/favicon.ico' />
				<link rel='apple-touch-icon' sizes='180x180' href='/icons/apple-touch-icon.png' />
				<link rel='icon' type='image/png' sizes='32x32' href='/icons/favicon-32x32.png' />
				<link rel='icon' type='image/png' sizes='16x16' href='/icons/favicon-16x16.png' />
			</head>
			<body
				className={dm_sans.className + ' overflow-x-hidden'}
				style={{ backgroundColor: '#FDFDFD' }}
			>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
