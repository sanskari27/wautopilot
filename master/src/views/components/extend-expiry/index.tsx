import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	useDisclosure,
} from '@chakra-ui/react';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useDispatch } from 'react-redux';
import AdminsService from '../../../services/admin.service';
import { setAdminExpiry } from '../../../store/reducers/AdminReducer';
import { Admin } from '../../../store/types/AdminState';

export type ExtendExpiryModalHandle = {
	open: (admin: Admin) => void;
	close: () => void;
};

const initialState: Admin = {
	id: '',
	name: '',
	email: '',
	isSubscribed: false,
	phone: '',
	subscription_expiry: '',
};

const ExtendExpiryModal = forwardRef<ExtendExpiryModalHandle>((_, ref) => {
	const dispatch = useDispatch();

	const { isOpen, onOpen, onClose } = useDisclosure();

	const [admin, setAdmin] = useState(initialState);

	const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

	useImperativeHandle(ref, () => ({
		open: (admin) => {
			onOpen();
			setAdmin(admin);
		},
		close: () => {
			closeModal();
		},
	}));

	const closeModal = () => {
		setAdmin(initialState);
		onClose();
	};

	const extendExpiry = (id: string, date: string) => {
		AdminsService.extendExpiry(id, date).then((res) => {
			if (res) {
				dispatch(setAdminExpiry({ id, date }));
				closeModal();
			}
		});
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Extend Expiry</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Text>Are you sure? You can't undo this action afterwards.</Text>
					<Input
						placeholder='Enter new expiry date'
						type='date'
						onChange={(e) => setDate(e.target.value)}
						min={new Date().toISOString().split('T')[0]}
						value={date}
					/>
				</ModalBody>
				<ModalFooter>
					<Button colorScheme='red' variant={'outline'} mr={3} onClick={onClose}>
						Close
					</Button>
					<Button colorScheme='green' onClick={() => extendExpiry(admin.id, date)}>
						Extend
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
});

export default ExtendExpiryModal;
