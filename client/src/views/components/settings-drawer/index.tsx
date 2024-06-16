import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
} from '@chakra-ui/react';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useSelector } from 'react-redux';
import { StoreNames, StoreState } from '../../../store';

export type SettingsDrawerHandle = {
	open: () => void;
	close: () => void;
};

const SettingsDrawer = forwardRef<SettingsDrawerHandle>((_, ref) => {
	const [isOpen, setIsOpen] = useState(false);

	const { user_details } = useSelector((state: StoreState) => state[StoreNames.USER]);

	useImperativeHandle(ref, () => ({
		open: () => {
			setIsOpen(true);
		},
		close: () => onclose,
	}));

	const onClose = () => setIsOpen(false);

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Settings</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<HStack justifyContent={'space-between'}>
							<Box
								background={user_details.isSubscribed ? 'rgb(198 227 255)' : 'rgb(255 201 201)'}
								width={'fit-content'}
								px={'1rem'}
								py={'0.5rem'}
								rounded={'lg'}
								color={user_details.isSubscribed ? 'rgb(21 143 255)' : 'rgb(255, 38, 38)'}
								mb={'1rem'}
							>
								<Text>{user_details.isSubscribed ? 'Subscribed' : 'Not Subscribed'}</Text>
							</Box>
							<Box
								background={'rgb(198 227 255)'}
								width={'fit-content'}
								px={'1rem'}
								py={'0.5rem'}
								rounded={'lg'}
								color={'rgb(21 143 255)'}
								mb={'1rem'}
							>
								<Text>Balance : ₹{user_details.walletBalance}</Text>
							</Box>
						</HStack>
						<Flex direction={'column'} gap={'0.5rem'}>
							<FormControl>
								<FormLabel mb={0}>Name</FormLabel>
								<Input value={user_details.name} />
							</FormControl>
							<FormControl>
								<FormLabel mb={0}>Email</FormLabel>
								<Input value={user_details.email} />
							</FormControl>
							<FormControl>
								<FormLabel mb={0}>Phone Number</FormLabel>
								<Input value={user_details.phone} />
							</FormControl>
						</Flex>
					</ModalBody>

					<ModalFooter>
						<Button colorScheme='teal'>Add Money</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
});

export default SettingsDrawer;
