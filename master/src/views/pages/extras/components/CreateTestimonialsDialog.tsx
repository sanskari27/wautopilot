import {
	Button,
	Flex,
	FormControl,
	FormLabel,
	Input,
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
import {
	setDescription,
	setName,
	setPhotoUrl,
	setTestimonialDetails,
	setTitle,
} from '../../../../store/reducers/TestimonialReducer';

export type TestimonialHandle = {
	open(
		details: { title: string; name: string; photo_url: string; description: string },
		index?: number
	): void;
};

type CreateTestimonialDialogProps = {
	onConfirm: (
		details: { title: string; name: string; photo_url: string; description: string },
		index?: number
	) => void;
};

const CreateTestimonialDialog = forwardRef<TestimonialHandle, CreateTestimonialDialogProps>(
	({ onConfirm }, ref) => {
		const dispatch = useDispatch();
		const toast = useToast();
		const [isOpen, setIsOpen] = useState(false);
		const [index, setIndex] = useState<number | undefined>(undefined);

		const {
			details: { description, name, photo_url, title },
		} = useSelector((state: StoreState) => state[StoreNames.TESTIMONIAL]);

		useImperativeHandle(ref, () => ({
			open(
				details: { title: string; name: string; photo_url: string; description: string },
				index?: number
			) {
				setIndex(index);
				dispatch(setTestimonialDetails(details));
				setIsOpen(true);
			},
		}));

		const onClose = () => {
			dispatch(setTestimonialDetails({ description: '', name: '', photo_url: '', title: '' }));
			setIsOpen(false);
		};

		const handleSave = () => {
			if (!title)
				return toast({
					title: 'Title is required',
					status: 'error',
				});
			if (!name)
				return toast({
					title: 'Name is required',
					status: 'error',
				});

			if (!photo_url)
				return toast({
					title: 'Photo URL is required',
					status: 'error',
				});
			if (!description)
				return toast({
					title: 'Description is required',
					status: 'error',
				});

			onConfirm({ title, name, photo_url, description }, index);
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
									placeholder='Testimonial Title'
									value={title}
								/>
							</FormControl>
							<FormControl>
								<FormLabel m={0}>Name</FormLabel>
								<Input
									onChange={(e) => dispatch(setName(e.target.value))}
									placeholder='Testimonial Name'
									value={name}
								/>
							</FormControl>
							<FormControl>
								<FormLabel m={0}>Photo URL</FormLabel>
								<Input
									onChange={(e) => dispatch(setPhotoUrl(e.target.value))}
									placeholder='Testimonial Photo URL'
									value={photo_url}
								/>
							</FormControl>
							<FormControl>
								<FormLabel m={0}>Description</FormLabel>
								<Textarea
									onChange={(e) => dispatch(setDescription(e.target.value))}
									placeholder='Testimonial Description'
									value={description}
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
	}
);

export default CreateTestimonialDialog;
