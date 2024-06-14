import { Box, useBoolean } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useOutlet } from 'react-router-dom';
import { NAVIGATION } from '../../../config/const';
import AuthService from '../../../services/auth.service';
import DeviceService from '../../../services/device.service';
import { StoreNames, StoreState } from '../../../store';
import {
	setDevicesList,
	startDeviceLoading,
	stopDeviceLoading,
} from '../../../store/reducers/DevicesReducers';
import { setIsAuthenticated, setSelectedDeviceId } from '../../../store/reducers/UserReducers';
import AppNavbar from '../../components/navbar/AppNavbar';
import NavigationDrawer from '../../components/navbar/NavigationDrawer';

const AppPage = () => {
	const outlet = useOutlet();

	const dispatch = useDispatch();

	const [authLoaded, setAuthLoaded] = useBoolean(false);

	const [expanded, setDrawerExpanded] = useBoolean(false);

	const { isAuthenticated } = useSelector((state: StoreState) => state[StoreNames.USER]);

	useEffect(() => {
		AuthService.isAuthenticated().then((res) => {
			dispatch(setIsAuthenticated(res));
			setAuthLoaded.on();
		});
	}, [dispatch, setAuthLoaded]);

	useEffect(() => {
		dispatch(startDeviceLoading());
		DeviceService.listDevices()
			.then((devices) => {
				dispatch(setDevicesList(devices));
				// setDevices(devices);
				if (devices.length > 0) {
					dispatch(setSelectedDeviceId(devices[0].id ?? '')); // TODO
					// dispatch(setSelectedDevice(devices[0]));
				}
			})
			.finally(() => dispatch(stopDeviceLoading()));
	}, [dispatch]);

	if (!authLoaded) return null;

	if (!isAuthenticated) return <Navigate to={`${NAVIGATION.AUTH}/${NAVIGATION.LOGIN}`} />;

	if (!outlet) return <Navigate to={`${NAVIGATION.APP}/${NAVIGATION.DASHBOARD}`} />;

	return (
		<Box width={'full'}>
			<AppNavbar expanded={expanded} setDrawerExpanded={setDrawerExpanded} />
			<NavigationDrawer expanded={expanded} setDrawerExpanded={setDrawerExpanded} />
			<Box
				className='ml-0 md:ml-[70px] overflow-y-auto overflow-x-hidden'
				height={'calc(100vh - 50px)'}
			>
				{outlet}
			</Box>
		</Box>
	);
};

export default AppPage;
