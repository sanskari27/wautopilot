import { AdminProvider } from '@/components/context/admin';
import Loading from '@/components/elements/loading';
import AdminsService from '@/services/admin.service';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Admins • Wautopilot',
};

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const list = await AdminsService.listAdmins()!;

	return (
		<Suspense fallback={<Loading />}>
			<AdminProvider data={list}>{children}</AdminProvider>
		</Suspense>
	);
}
