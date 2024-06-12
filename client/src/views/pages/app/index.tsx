import { Box, useBoolean } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useOutlet } from 'react-router-dom';
import { NAVIGATION } from '../../../config/const';
import DeviceService from '../../../services/device.service';
import { StoreNames, StoreState } from '../../../store';
import {
	setDevicesList,
	startDeviceLoading,
	stopDeviceLoading,
} from '../../../store/reducers/DevicesReducers';
import { setSelectedDeviceId } from '../../../store/reducers/UserReducers';
import AppNavbar from '../../components/navbar/AppNavbar';
import NavigationDrawer from '../../components/navbar/NavigationDrawer';

const AppPage = () => {
	const outlet = useOutlet();

	const dispatch = useDispatch();

	const [expanded, setDrawerExpanded] = useBoolean(false);

	const { isAuthenticated } = useSelector((state: StoreState) => state[StoreNames.USER]);

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
	}, []);

	if (!isAuthenticated) return <Navigate to={`${NAVIGATION.AUTH}/${NAVIGATION.LOGIN}`} />;

	if (!outlet) return <Navigate to={`${NAVIGATION.APP}/${NAVIGATION.DASHBOARD}`} />;

	return (
		<Box width={'full'}>
			<AppNavbar expanded={expanded} setDrawerExpanded={setDrawerExpanded} />
			<NavigationDrawer expanded={expanded} setDrawerExpanded={setDrawerExpanded} />
			<Box className='ml-0 md:ml-[70px] overflow-scroll' maxHeight={'calc(100vh - 70px)'}>
				{outlet}
			</Box>
		</Box>
	);
};

export default AppPage;
