import {
	Flex,
	Image,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
	useBoolean,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { Color, LOGO_PRIMARY, NAVIGATION } from '../../../config/const';
import { StoreNames, StoreState } from '../../../store';
import LoginTab from './login-tab';
import SignupTab from './signup-tab';

export default function LoginPopup() {
	const [isOpen, setIsOpen] = useBoolean(true);
	const navigate = useNavigate();
	const { isAuthenticated } = useSelector((state: StoreState) => state[StoreNames.USER]);

	const onClose = () => {
		navigate(NAVIGATION.HOME);
		setIsOpen.off();
	};

	if (isAuthenticated) {
		return <Navigate to={NAVIGATION.APP} replace={true} />;
	}

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered size={'lg'}>
			<ModalOverlay />
			<ModalContent rounded={'2xl'} padding={'1rem'}>
				<ModalHeader>
					<Flex alignItems={'center'} gap={'0.5rem'} justifyContent={'center'}>
						<Image src={LOGO_PRIMARY} height={'2.5rem'} />
						<Text color={Color.ACCENT_DARK} fontWeight={'bold'} fontSize={'3xl'}>
							Wautopilot
						</Text>
					</Flex>
				</ModalHeader>
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
}
