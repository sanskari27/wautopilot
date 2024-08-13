import Footer from '@/components/elements/footer';
import { HomeNavbar } from '@/components/elements/Navbar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Policies • Wautopilot',
};

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main>
			<HomeNavbar />
			{children}
			<Footer />
		</main>
	);
}
