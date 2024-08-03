import {
	Button,
	FormControl,
	FormLabel,
	HStack,
	Input,
	InputGroup,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useBoolean,
	useToast,
} from '@chakra-ui/react';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useDispatch } from 'react-redux';
import PhoneBookService from '../../../../services/phonebook.service';
import { setCSVLabels, setFile } from '../../../../store/reducers/PhonebookReducer';

export type AddFieldDialogHandle = {
	close: () => void;
	open: () => void;
};

const AddFieldDialog = forwardRef<AddFieldDialogHandle>((_, ref) => {
	const dispatch = useDispatch();
	const toast = useToast();
	const [isOpen, setOpen] = useBoolean();
	const [fieldName, setFieldName] = useState('');
	const [defaultValue, setDefaultValue] = useState('');

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

	async function handleSave() {
		toast.promise(PhoneBookService.addFields({ name: fieldName, defaultValue }), {
			success: () => {
				onClose();
				return { title: 'Field added successfully' };
			},
			error: { title: 'Failed to add field' },
			loading: { title: 'Adding field...' },
		});
	}

	return (
		<Modal isOpen={isOpen} onClose={onClose} size={'2xl'} scrollBehavior='inside'>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Add field to records</ModalHeader>
				<ModalBody pb={6}>
					<FormControl pt={'1rem'}>
						<FormLabel>Field Name</FormLabel>
						<InputGroup bgColor={'transparent'} borderWidth={'1px'} rounded={'md'}>
							<Input
								type='text'
								placeholder='Enter new field name'
								value={fieldName}
								onChange={(e) => setFieldName(e.target.value)}
							/>
						</InputGroup>
					</FormControl>
					<FormControl mt={'1rem'}>
						<FormLabel>Default Value</FormLabel>
						<InputGroup bgColor={'transparent'} borderWidth={'1px'} rounded={'md'}>
							<Input
								type='text'
								placeholder='Default value if field not exists'
								value={defaultValue}
								onChange={(e) => setDefaultValue(e.target.value)}
							/>
						</InputGroup>
					</FormControl>
				</ModalBody>

				<ModalFooter>
					<HStack width={'full'} justifyContent={'flex-end'}>
						<Button onClick={onClose} colorScheme='red'>
							Cancel
						</Button>
						<Button colorScheme='green' mr={3} onClick={handleSave}>
							Save
						</Button>
					</HStack>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
});

export default AddFieldDialog;
