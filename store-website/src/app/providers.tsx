// app/providers.tsx
'use client';

import { createSession } from '@/services/session.service';
import { ChakraProvider } from '@chakra-ui/react';
import { useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		createSession();
	}, []);
	return <ChakraProvider>{children}</ChakraProvider>;
}
