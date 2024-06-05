import { Suspense, lazy, useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { NAVIGATION } from './config/const';

import { Flex, Progress } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { useGeoLocation } from './hooks/useGeolocation';
import AuthService from './services/auth.service';
import { setIsAuthenticated } from './store/reducers/UserReducers';

const Home = lazy(() => import('./views/pages/_'));
const Terms = lazy(() => import('./views/pages/_/terms'));
const Privacy = lazy(() => import('./views/pages/_/privacy'));
const Disclaimer = lazy(() => import('./views/pages/_/disclaimer'));
const Login = lazy(() => import('./views/pages/auth/login'));
const AuthPage = lazy(() => import('./views/pages/auth'));
const ResetPassword = lazy(() => import('./views/pages/auth/reset-password'));
const AppPage = lazy(() => import('./views/pages/app'));
const PhoneBook = lazy(() => import('./views/pages/app/phonebook'));

function App() {
	const dispatch = useDispatch();
	useEffect(() => {
		AuthService.isAuthenticated().then((res) => {
			console.log(res);
			if (res) {
				dispatch(setIsAuthenticated(true));
			}
		});
	}, [dispatch]);
	useGeoLocation();

	return (
		<Flex minHeight={'100vh'} width={'100vw'} className='bg-background '>
			<Router>
				<Suspense fallback={<Loading />}>
					<Routes>
						<Route path={NAVIGATION.HOME} element={<Home />} />
						<Route path={NAVIGATION.TERMS} element={<Terms />} />
						<Route path={NAVIGATION.PRIVACY} element={<Privacy />} />
						<Route path={NAVIGATION.DISCLAIMER} element={<Disclaimer />} />
						<Route path={NAVIGATION.AUTH} element={<AuthPage />}>
							<Route path={NAVIGATION.LOGIN} element={<Login />} />
							<Route path={NAVIGATION.RESET} element={<ResetPassword />} />
						</Route>
						<Route path={NAVIGATION.APP} element={<AppPage />}>
							<Route path={NAVIGATION.DASHBOARD} element={<>sadf</>} />
							<Route path={NAVIGATION.INBOX} element={<>sdf</>} />
							<Route path={NAVIGATION.PHONEBOOK} element={<PhoneBook />} />
						</Route>
						{/* <Route path='*' element={<Home />} /> */}
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
						{/* <Image src={LOGO} width={'280px'} className='shadow-lg rounded-full animate-pulse' /> */}
					</Flex>
					<Progress size='xs' isIndeterminate width={'150%'} rounded={'lg'} marginTop={'-3rem'} />
				</Flex>
			</Flex>
		</Flex>
	);
};

export default App;
