import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ChakraProvider toastOptions={{ defaultOptions: { position: 'top', variant: 'top-accent' } }}>
			<App />
		</ChakraProvider>
	</React.StrictMode>
);
