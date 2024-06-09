import { Box, useBoolean } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { Navigate, useOutlet } from 'react-router-dom';
import { NAVIGATION } from '../../../config/const';
import { StoreNames, StoreState } from '../../../store';
import AppNavbar from '../../components/navbar/AppNav';
import NavigationDrawer from '../../components/navbar/NavigationDrawer';

const AppPage = () => {
	const outlet = useOutlet();
	const [expanded, setDrawerExpanded] = useBoolean(false);

	const { isAuthenticated } = useSelector((state: StoreState) => state[StoreNames.USER]);

	if (!isAuthenticated) return <Navigate to={`${NAVIGATION.AUTH}/${NAVIGATION.LOGIN}`} />;

	if (!outlet) return <Navigate to={`${NAVIGATION.APP}/${NAVIGATION.DASHBOARD}`} />;

	return (
		<Box width={'full'}>
			<AppNavbar expanded={expanded} setDrawerExpanded={setDrawerExpanded} />
			<NavigationDrawer expanded={expanded} />
			<Box className='ml-0 md:ml-[70px]'>{outlet}</Box>
		</Box>
	);
};

export default AppPage;
