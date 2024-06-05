import { Box, useBoolean } from '@chakra-ui/react';
import { useOutlet } from 'react-router-dom';
import AppNavbar from '../../components/navbar/appNavbar';
import NavigationDrawer from '../../components/navigation-drawer';

const AppPage = () => {
	const outlet = useOutlet();
	const [flag, setFlag] = useBoolean(false);

	return (
		<Box width={'full'}>
			<AppNavbar setFlag={setFlag} />
			<NavigationDrawer flag={flag} />
			<Box className='md:ml-[70px]'>{outlet}</Box>
		</Box>
	);
};

export default AppPage;
