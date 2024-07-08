/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	Flex,
	FormControl,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
} from '@chakra-ui/react';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AuthService from '../../../services/auth.service';
import { StoreNames, StoreState } from '../../../store';
import { setUserDetails } from '../../../store/reducers/UserReducers';

export type SettingsDrawerHandle = {
	open: () => void;
	close: () => void;
};

const SettingsDrawer = forwardRef<SettingsDrawerHandle>((_, ref) => {
	const dispatch = useDispatch();
	const [isOpen, setIsOpen] = useState(false);

	const { user_details } = useSelector((state: StoreState) => state[StoreNames.USER]);

	useImperativeHandle(ref, () => ({
		open: () => {
			setIsOpen(true);
		},
		close: () => onclose,
	}));

	const onClose = () => setIsOpen(false);

	useEffect(() => {
		AuthService.userDetails().then((user) => user && dispatch(setUserDetails(user)));
	}, [dispatch]);

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Settings</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Flex direction={'column'} gap={'0.5rem'}>
							<FormControl>
								<FormLabel mb={0}>Name</FormLabel>
								<Input value={user_details.name} readOnly />
							</FormControl>
							<FormControl>
								<FormLabel mb={0}>Email</FormLabel>
								<Input value={user_details.email} readOnly />
							</FormControl>
							<FormControl>
								<FormLabel mb={0}>Phone Number</FormLabel>
								<Input value={user_details.phone} readOnly />
							</FormControl>
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
});

export default SettingsDrawer;
