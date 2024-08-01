'use client';

import { ThemeProvider } from '@/components/context/theme-provider';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider attribute='class' defaultTheme='light' enableSystem disableTransitionOnChange>
			{children}
			<Toaster position='top-center' />
		</ThemeProvider>
	);
}
