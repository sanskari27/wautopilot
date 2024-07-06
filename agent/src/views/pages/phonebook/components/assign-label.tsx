import {
	Button,
	FormControl,
	FormLabel,
	HStack,
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
import { forwardRef, useImperativeHandle } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PhoneBookService from '../../../../services/phonebook.service';
import { StoreNames, StoreState } from '../../../../store';
import { setCSVLabels, setFile } from '../../../../store/reducers/PhonebookReducer';

export type AssignLabelDialogHandle = {
	close: () => void;
	open: () => void;
};

const AssignLabelDialog = forwardRef<AssignLabelDialogHandle>((_, ref) => {
	const dispatch = useDispatch();
	const toast = useToast();
	const [isOpen, setOpen] = useBoolean();

	const {
		csv: { labels },
		selected,
		uiDetails: { isSaving },
	} = useSelector((state: StoreState) => state[StoreNames.PHONEBOOK]);

	const onClose = () => {
		dispatch(setFile(null));
		dispatch(setCSVLabels([]));
		setOpen.off();
	};

	useImperativeHandle(ref, () => ({
		close: () => {
			onClose();
		},
		open: () => {
			setOpen.on();
		},
	}));

	const handleSave = async () => {
		PhoneBookService.assignLabels(selected, labels)
			.then(() => {
				onClose();

				toast({
					title: 'Records updated successfully',
					description: 'Please refresh the page to see the changes.',
					status: 'success',
					duration: 5000,
					isClosable: true,
				});
			})
			.catch((err) => {
				toast({
					title: 'Error uploading csv file',
					description: err.message,
					status: 'error',
					duration: 5000,
					isClosable: true,
				});
			});
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size={'2xl'} scrollBehavior='inside'>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Bulk Assign Tags</ModalHeader>
				<ModalBody pb={6}>
					<FormControl pt={'1rem'}>
						<FormLabel>Tags</FormLabel>
						<Textarea
							placeholder={`Enter tags here separated by comma`}
							value={labels.join(', ') ?? ''}
							onChange={(e) =>
								dispatch(setCSVLabels(e.target.value.split(',').map((label) => label.trim())))
							}
						/>
					</FormControl>
				</ModalBody>

				<ModalFooter>
					<HStack width={'full'} justifyContent={'flex-end'}>
						<Button onClick={onClose} colorScheme='red' isDisabled={isSaving}>
							Cancel
						</Button>
						<Button colorScheme='green' mr={3} onClick={handleSave} isLoading={isSaving}>
							Save
						</Button>
					</HStack>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
});

export default AssignLabelDialog;
