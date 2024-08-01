import PageLayout from '@/components/containers/page-layout';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Auth',
};

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<PageLayout>
			{children}
			<BackgroundBeams />
		</PageLayout>
	);
}
