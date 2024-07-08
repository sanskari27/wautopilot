import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import 'reactflow/dist/style.css';
import App from './App.tsx';
import './index.css';
import store from './store/store.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Provider store={store}>
			<ChakraProvider toastOptions={{ defaultOptions: { position: 'top', variant: 'top-accent' } }}>
				<App />
			</ChakraProvider>
		</Provider>
	</React.StrictMode>
);
