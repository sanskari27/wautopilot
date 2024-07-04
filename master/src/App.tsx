import { Suspense, lazy, useEffect } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { NAVIGATION } from './config/const';

import { Box, Flex, Progress, useBoolean } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import AdminsService from './services/admin.service';
import AuthService from './services/auth.service';
import CouponService from './services/coupon.service';
import ExtrasService from './services/extras.service';
import { listAdmins, setAdminLoading } from './store/reducers/AdminReducer';
import { setCouponFetching, setCouponList } from './store/reducers/CouponReducer';
import { setFAQList, setFAQLoading } from './store/reducers/FAQReducer';
import { setTestimonialList, setTestimonialLoading } from './store/reducers/TestimonialReducer';
import { setIsAuthenticated } from './store/reducers/UserReducers';
import AppNavbar from './views/components/navbar/AppNavbar';
import NavigationDrawer from './views/components/navbar/NavigationDrawer';

const AdminPage = lazy(() => import('./views/pages/admin'));
const CouponPage = lazy(() => import('./views/pages/coupons'));
const ExtrasPage = lazy(() => import('./views/pages/extras'));

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
		CouponService.listCoupons()
			.then((res) => {
				dispatch(setCouponList(res));
			})
			.finally(() => dispatch(setCouponFetching(false)));
		ExtrasService.getFAQs()
			.then((res) => {
				dispatch(setFAQList(res));
			})
			.finally(() => dispatch(setFAQLoading(false)));
		ExtrasService.getTestimonials()
			.then((res) => {
				dispatch(setTestimonialList(res));
			})
			.finally(() => {
				dispatch(setTestimonialLoading(false));
			});
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
							<Route path={NAVIGATION.COUPONS} element={<CouponPage />} />
							<Route path={NAVIGATION.EXTRAS} element={<ExtrasPage />} />
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
