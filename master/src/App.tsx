import { Suspense, lazy, useEffect } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { NAVIGATION } from './config/const';

import { Box, Flex, Progress, useBoolean } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import AdminsService from './services/admin.service';
import AuthService from './services/auth.service';
import { listAdmins, setAdminLoading } from './store/reducers/AdminReducer';
import { setIsAuthenticated } from './store/reducers/UserReducers';
import AppNavbar from './views/components/navbar/AppNavbar';
import NavigationDrawer from './views/components/navbar/NavigationDrawer';

const AdminPage = lazy(() => import('./views/pages/admin'));

function App() {
	const dispatch = useDispatch();
	const [expanded, setDrawerExpanded] = useBoolean(false);

	useEffect(() => {
		AuthService.isAuthenticated().then((res) => {
			dispatch(setIsAuthenticated(res));
		});
		AdminsService.listAdmins()
			.then((res) => {
				dispatch(listAdmins(res));
			})
			.finally(() => dispatch(setAdminLoading(false)));
	}, [dispatch]);

	return (
		<Router>
			<Flex minHeight={'100vh'} width={'100vw'} className='bg-background ' direction={'column'}>
				<AppNavbar expanded={expanded} setDrawerExpanded={setDrawerExpanded} />
				<NavigationDrawer expanded={expanded} setDrawerExpanded={setDrawerExpanded} />
				<Box
					className='ml-0 md:ml-[70px] overflow-y-auto overflow-x-hidden'
					height={'calc(100vh - 50px)'}
				>
					<Suspense fallback={<Loading />}>
						<Routes>
							<Route path={NAVIGATION.ADMINS} element={<AdminPage />} />
							<Route path='*' element={<Navigate to={NAVIGATION.ADMINS} />} />
						</Routes>
					</Suspense>
				</Box>
			</Flex>
		</Router>
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
