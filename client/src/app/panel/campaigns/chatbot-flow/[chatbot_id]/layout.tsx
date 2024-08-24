import Loading from '@/components/elements/loading';
import { Suspense } from 'react';

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <Suspense fallback={<Loading />}>{children}</Suspense>;
}
