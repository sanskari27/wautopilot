import { Suspense, lazy, useEffect } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { NAVIGATION } from './config/const';

import { Flex, Progress } from '@chakra-ui/react';
import Lottie from 'lottie-react';
import { useDispatch } from 'react-redux';
import { LOADING } from './assets/Lottie';
import { useGeoLocation } from './hooks/useGeolocation';
import AuthService from './services/auth.service';
import { setIsAuthenticated, stopUserAuthenticating } from './store/reducers/UserReducers';

const ResetPassword = lazy(() => import('./views/pages/reset-password'));
const LoginPopup = lazy(() => import('./views/components/loginPopup'));

function App() {
	const dispatch = useDispatch();
	useGeoLocation();

	useEffect(() => {
		AuthService.isAuthenticated()
			.then((res) => {
				dispatch(setIsAuthenticated(res));
			})
			.finally(() => dispatch(stopUserAuthenticating()));
	}, [dispatch]);

	return (
		<Flex height={'100vh'} width={'100vw'} className='bg-background'>
			<Router>
				<Suspense fallback={<Loading />}>
					<Routes>
						<Route path={`${NAVIGATION.AUTH}/${NAVIGATION.LOGIN}`} element={<LoginPopup />} />
						<Route path={`${NAVIGATION.AUTH}/${NAVIGATION.RESET}`} element={<ResetPassword />} />
						<Route path='*' element={<Navigate to={`${NAVIGATION.AUTH}/${NAVIGATION.LOGIN}`} />} />
					</Routes>
				</Suspense>
			</Router>
		</Flex>
	);
}

const Loading = () => {
	return (
		<Flex
			direction={'column'}
			justifyContent={'center'}
			alignItems={'center'}
			flexDirection='column'
			width={'100vw'}
			height={'100vh'}
		>
			<Flex
				direction={'column'}
				justifyContent={'center'}
				alignItems={'center'}
				flexDirection='column'
				padding={'3rem'}
				rounded={'lg'}
				width={'500px'}
				height={'550px'}
				className='border shadow-xl drop-shadow-xl '
			>
				<Flex justifyContent={'center'} alignItems={'center'} direction={'column'}>
					<Flex justifyContent={'center'} alignItems={'center'} width={'full'}>
						<Lottie animationData={LOADING} />
					</Flex>
					<Progress size='xs' isIndeterminate width={'150%'} rounded={'lg'} marginTop={'-3rem'} />
				</Flex>
			</Flex>
		</Flex>
	);
};

export default App;
