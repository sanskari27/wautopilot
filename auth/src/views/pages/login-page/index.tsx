import {
	Box,
	Center,
	Flex,
	Image,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { ADMIN_URL, Color, LOGO_PRIMARY, WEBPAGE_URL } from '../../../config/const';
import { useGeoLocation } from '../../../hooks/useGeolocation';
import AuthService from '../../../services/auth.service';
import { StoreNames, StoreState } from '../../../store';
import { setIsAuthenticated, stopUserLoading } from '../../../store/reducers/UserReducers';
import InvalidPage from '../../components/invalid-page';
import LoginTab from './login-tab';
import SignupTab from './signup-tab';

export default function LoginPopup() {
	useGeoLocation();

	const dispatch = useDispatch();
	const { login_type } = useParams();

	const [params] = useSearchParams();
	const callback_url = params.get('callback_url');

	const {
		uiDetails: { isLoading, isAuthenticated },
	} = useSelector((state: StoreState) => state[StoreNames.USER]);

	const [invalidLogin, setInvalidLogin] = useState(false);

	useEffect(() => {
		if (!login_type || !['admin', 'master', 'agent'].includes(login_type)) {
			setInvalidLogin(true);
			dispatch(setIsAuthenticated(false));
			dispatch(stopUserLoading());
			return;
		}
		AuthService.isAuthenticated(login_type as 'admin' | 'master' | 'agent').then((res) => {
			dispatch(setIsAuthenticated(res));
			dispatch(stopUserLoading());
		});
	}, [dispatch, login_type]);

	if (isLoading) {
		return <></>;
	}

	if (isAuthenticated) {
		if (callback_url) {
			window.location.href = callback_url;
			return <></>;
		}
		window.location.href = WEBPAGE_URL;
		return <></>;
	}

	if (invalidLogin) {
		return <InvalidPage />;
	}

	return (
		<Flex justifyContent={'center'} width={'100vw'} minHeight={'100vh'}>
			<Center>
				<Box
					className='w-[90vw] max-w-[500px]'
					borderWidth={'2px'}
					rounded={'xl'}
					py={'1rem'}
					px={'2rem'}
				>
					<Flex alignItems={'center'} gap={'0.5rem'} justifyContent={'center'}>
						<Image src={LOGO_PRIMARY} height={'2.5rem'} />
						<Text color={Color.ACCENT_DARK} fontWeight={'bold'} fontSize={'3xl'}>
							Wautopilot
						</Text>
					</Flex>
					<Tabs
						width={'full'}
						isFitted
						variant='soft-rounded'
						size={'sm'}
						colorScheme='green'
						mt={'1rem'}
					>
						<TabList width={'200px'} margin={'auto'} bgColor={'whitesmoke'} rounded={'full'}>
							<Tab>Login</Tab>
							<Tab isDisabled={!callback_url?.startsWith(ADMIN_URL)}>Signup</Tab>
						</TabList>
						<TabPanels>
							<TabPanel>
								<LoginTab />
							</TabPanel>
							<TabPanel>
								<SignupTab />
							</TabPanel>
						</TabPanels>
					</Tabs>
				</Box>
			</Center>
		</Flex>
	);
}
