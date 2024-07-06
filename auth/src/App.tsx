import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { NAVIGATION } from './config/const';

import { Flex } from '@chakra-ui/react';
import InvalidPage from './views/components/invalid-page';

const ResetPassword = lazy(() => import('./views/pages/reset-password'));
const LoginPopup = lazy(() => import('./views/pages/login-page'));

function App() {
	return (
		<Flex height={'100vh'} width={'100vw'}>
			<Suspense fallback={<Loading />}>
				<Routes>
					<Route
						path={`${NAVIGATION.AUTH}/:login_type/${NAVIGATION.LOGIN}`}
						element={<LoginPopup />}
					/>
					<Route path={`${NAVIGATION.AUTH}/${NAVIGATION.RESET}`} element={<ResetPassword />} />
					<Route path='*' element={<InvalidPage />} />
				</Routes>
			</Suspense>
		</Flex>
	);
}

const Loading = () => {
	return <></>;
};

export default App;
