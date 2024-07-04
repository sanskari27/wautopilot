import {
	Button,
	Flex,
	FormControl,
	FormLabel,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Textarea,
	useToast,
} from '@chakra-ui/react';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StoreNames, StoreState } from '../../../../store';
import { setFAQDetails, setInfo, setTitle } from '../../../../store/reducers/FAQReducer';

export type FAQHandle = {
	open(details: { title: string; info: string }, index?: number): void;
};

type CreateFAQDialogProps = {
	onConfirm: (details: { title: string; info: string }, index?: number) => void;
};

const CreateFAQDialog = forwardRef<FAQHandle, CreateFAQDialogProps>(({ onConfirm }, ref) => {
	const dispatch = useDispatch();
	const toast = useToast();
	const [isOpen, setIsOpen] = useState(false);
	const [index, setIndex] = useState<number | undefined>(undefined);

	const {
		details: { info, title },
	} = useSelector((state: StoreState) => state[StoreNames.FAQ]);

	useImperativeHandle(ref, () => ({
		open(details: { title: string; info: string }, index?: number) {
			setIndex(index);
			dispatch(setFAQDetails(details));
			setIsOpen(true);
		},
	}));

	const onClose = () => {
		setIsOpen(false);
		dispatch(setFAQDetails({ title: '', info: '' }));
	};

	const handleSave = () => {
		if (!title || !info)
			return toast({
				title: 'Error',
				description: 'Please fill all the fields',
				status: 'error',
			});

		onConfirm({ title, info }, index);
		setIsOpen(false);
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size={'4xl'}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Create FAQ</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Flex direction={'column'} gap={'1rem'}>
						<FormControl>
							<FormLabel m={0}>Title</FormLabel>
							<Textarea
								onChange={(e) => dispatch(setTitle(e.target.value))}
								placeholder='FAQ question'
								value={title}
							/>
						</FormControl>
						<FormControl>
							<FormLabel m={0}>Info</FormLabel>
							<Textarea
								onChange={(e) => dispatch(setInfo(e.target.value))}
								placeholder='FAQ answer'
								value={info}
							/>
						</FormControl>
					</Flex>
				</ModalBody>

				<ModalFooter>
					<Button colorScheme='red' variant={'outline'} mr={3} onClick={onClose}>
						Close
					</Button>
					<Button colorScheme='green' onClick={handleSave}>
						Save
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
});

export default CreateFAQDialog;
