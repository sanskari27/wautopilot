import {
	Button,
	FormControl,
	FormLabel,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Textarea,
	useBoolean,
	useToast,
} from '@chakra-ui/react';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useSelector } from 'react-redux';
import MessagesService from '../../../../services/messages.service';
import { StoreNames, StoreState } from '../../../../store';

export type ConversationNotesHandle = {
	close: () => void;
	open: () => void;
};

const ConversationNotes = forwardRef<ConversationNotesHandle>((_, ref) => {
	const [isOpen, setOpen] = useBoolean();
	const [note, setNote] = useState<string>('');
	const toast = useToast();
	const { selected_device_id } = useSelector((state: StoreState) => state[StoreNames.USER]);
	const { selected_recipient } = useSelector((state: StoreState) => state[StoreNames.RECIPIENT]);

	const onClose = () => {
		setNote('');
		setOpen.off();
	};

	useImperativeHandle(ref, () => ({
		close: () => {
			onClose();
		},
		open: () => {
			MessagesService.getNote(selected_device_id, selected_recipient._id)
				.then(setNote)
				.catch(() => {});
			setOpen.on();
		},
	}));

	function handleSave() {
		MessagesService.setNote(selected_device_id, selected_recipient._id, note).then(() => {
			toast({
				title: 'Note saved',
				status: 'success',
				duration: 3000,
				isClosable: true,
			});
			onClose();
		});
		toast.promise(MessagesService.setNote(selected_device_id, selected_recipient._id, note), {
			success: () => {
				onClose();
				return { title: 'Note saved' };
			},
			loading: { title: 'Saving note...' },
			error: { title: 'Failed to save note' },
		});
	}

	return (
		<Modal isOpen={isOpen} onClose={onClose} size={'2xl'} scrollBehavior='inside'>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Conversation Notes</ModalHeader>
				<ModalBody pb={6}>
					<FormControl pt={'1rem'}>
						<FormLabel>This conversation is about...</FormLabel>
						<Textarea
							value={note}
							onChange={(e) => setNote(e.target.value)}
							placeholder='This conversation is about...'
							size='sm'
						/>
					</FormControl>
				</ModalBody>
				<ModalFooter>
					<Button onClick={onClose} mr={3}>
						Cancel
					</Button>
					<Button colorScheme='green' onClick={handleSave}>
						Save
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
});

export default ConversationNotes;
