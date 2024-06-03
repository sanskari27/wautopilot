import {
	Button,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalOverlay,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
} from '@chakra-ui/react';
import { forwardRef, useImperativeHandle, useState } from 'react';
import LoginTab from './login-tab';
import SignupTab from './signup-tab';

export type LoginDialogProps = {
	open: () => void;
	close: () => void;
};
1;

const LoginDialog = forwardRef<LoginDialogProps>((_, ref) => {
	const [isOpen, onClose] = useState(false);

	useImperativeHandle(ref, () => ({
		open: () => onClose(true),
		close: () => onClose(false),
	}));

	const handleClose = () => onClose(false);

	return (
		<Modal isOpen={isOpen} onClose={handleClose} isCentered size={'2xl'}>
			<ModalOverlay />
			<ModalContent>
				<ModalCloseButton />
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
					<Button onClick={handleClose}>Close</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
});

export default LoginDialog;
