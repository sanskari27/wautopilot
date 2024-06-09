import { Suspense, lazy, useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { NAVIGATION } from './config/const';

import { Flex, Progress } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { useGeoLocation } from './hooks/useGeolocation';
import AuthService from './services/auth.service';
import { setIsAuthenticated } from './store/reducers/UserReducers';
import AddDevice from './views/components/addDevice';
import LoginPopup from './views/components/loginPopup';
import Broadcast from './views/pages/broadcast';
import Dashboard from './views/pages/dashboard';
import Phonebook from './views/pages/phonebook';
import Templates from './views/pages/templates';
import EditTemplate from './views/pages/templates/edit-template';

const Home = lazy(() => import('./views/pages/_'));
const Terms = lazy(() => import('./views/pages/static_pages/terms'));
const Privacy = lazy(() => import('./views/pages/static_pages/privacy'));
const Disclaimer = lazy(() => import('./views/pages/static_pages/disclaimer'));
const ResetPassword = lazy(() => import('./views/pages/reset-password'));
const AppPage = lazy(() => import('./views/pages/app'));

function App() {
	const dispatch = useDispatch();
	useGeoLocation();

	useEffect(() => {
		AuthService.isAuthenticated().then((res) => {
			dispatch(setIsAuthenticated(res));
		});
	}, [dispatch]);

	return (
		<Flex minHeight={'100vh'} width={'100vw'} className='bg-background '>
			<Router>
				<Suspense fallback={<Loading />}>
					<Routes>
						<Route path={NAVIGATION.HOME} element={<Home />}>
							<Route path={`${NAVIGATION.AUTH}/${NAVIGATION.LOGIN}`} element={<LoginPopup />} />
							<Route path={`${NAVIGATION.AUTH}/${NAVIGATION.RESET}`} element={<ResetPassword />} />
						</Route>
						<Route path={NAVIGATION.TERMS} element={<Terms />} />
						<Route path={NAVIGATION.PRIVACY} element={<Privacy />} />
						<Route path={NAVIGATION.DISCLAIMER} element={<Disclaimer />} />

						<Route path={NAVIGATION.APP} element={<AppPage />}>
							<Route path={NAVIGATION.DASHBOARD} element={<Dashboard />}>
								<Route path={NAVIGATION.ADD_DEVICE} element={<AddDevice />} />
							</Route>
							<Route path={NAVIGATION.PHONEBOOK} element={<Phonebook />} />
							<Route
								path={NAVIGATION.TEMPLATES + '/' + NAVIGATION.ADD_TEMPLATE}
								element={<EditTemplate />}
							/>
							<Route
								path={NAVIGATION.TEMPLATES + '/' + NAVIGATION.EDIT_TEMPLATE + '/:id'}
								element={<EditTemplate />}
							/>
							<Route path={NAVIGATION.TEMPLATES} element={<Templates />} />
							<Route path={NAVIGATION.BROADCAST} element={<Broadcast />} />
							<Route path={NAVIGATION.INBOX} element={<>sdf</>} />
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
