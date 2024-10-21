import Loading from '@/components/elements/loading';
import { Suspense } from 'react';
import DataProvider from './_components/data-provider'; // Import the new component

export const metadata = {
	title: 'Conversations • Wautopilot',
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<Suspense fallback={<Loading />}>
			<DataProvider>
				<section>{children}</section>
			</DataProvider>
		</Suspense>
	);
}
