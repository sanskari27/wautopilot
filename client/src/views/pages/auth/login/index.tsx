import {
	Modal,
	ModalBody,
	ModalContent,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NAVIGATION } from '../../../../config/const';
import useAuth from '../../../../hooks/useAuth';
import LoginTab from '../../../components/user-login/login-tab';
import SignupTab from '../../../components/user-login/signup-tab';

const Login = () => {
	const navigate = useNavigate();

	const { isAuthenticated } = useAuth();

	useEffect(() => {
		if (isAuthenticated) {
			navigate(`${NAVIGATION.APP}/${NAVIGATION.DASHBOARD}`);
		}
	}, [isAuthenticated, navigate]);

	return (
		<Modal
			onClose={() => {
				navigate(-1);
			}}
			closeOnOverlayClick={false}
			isOpen={true}
			isCentered
			size={'md'}
		>
			<ModalContent>
				<ModalBody>
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
							<Tab>Signup</Tab>
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
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default Login;
