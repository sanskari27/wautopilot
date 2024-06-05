import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalOverlay,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
} from '@chakra-ui/react';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useDispatch } from 'react-redux';
import { reset } from '../../../store/reducers/UserReducers';
import LoginTab from './login-tab';
import SignupTab from './signup-tab';

export type LoginDialogProps = {
	open: () => void;
	close: () => void;
};
1;

const LoginDialog = forwardRef<LoginDialogProps>((_, ref) => {
	const [isOpen, onClose] = useState(false);
	// const { isLocating } = useGeoLocation();
	const dispatch = useDispatch();

	useImperativeHandle(ref, () => ({
		open: () => onClose(true),
		close: () => onClose(false),
	}));

	const handleClose = () => onClose(false);

	useEffect(() => {
		dispatch(reset());
	}, [dispatch]);

	return (
		<Modal isOpen={isOpen} onClose={handleClose} isCentered size={'2xl'}>
			<ModalOverlay />
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
				<ModalFooter>
					<Button colorScheme='red' onClick={handleClose}>
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
});

export default LoginDialog;
