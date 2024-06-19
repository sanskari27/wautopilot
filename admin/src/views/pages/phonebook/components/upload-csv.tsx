import {
	Box,
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
	Text,
	Textarea,
	useBoolean,
	useToast,
} from '@chakra-ui/react';
import { forwardRef, useImperativeHandle } from 'react';
import Dropzone from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import PhoneBookService from '../../../../services/phonebook.service';
import { StoreNames, StoreState } from '../../../../store';
import { setCSVLabels, setError, setFile } from '../../../../store/reducers/PhonebookReducer';

export type UploadPhonebookDialogHandle = {
	close: () => void;
	open: () => void;
};

const UploadPhonebookDialog = forwardRef<UploadPhonebookDialogHandle>((_, ref) => {
	const dispatch = useDispatch();
	const toast = useToast();
	const [isOpen, setOpen] = useBoolean();

	const {
		csv: { file, labels },
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

	const handleAttachmentInput = (files: File) => {
		if (files === null) return;
		if (files.size > 10485760) return dispatch(setError('File size should be less than 10MB'));
		dispatch(setFile(files));
	};

	const handleUploadCSV = async () => {
		if (!file) return;

		PhoneBookService.bulkUpload(file, labels)
			.then(() => {
				onClose();
				toast({
					title: 'Records uploaded successfully',
					description: 'Please refresh to update.',
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
				<ModalHeader>Upload Bulk Records</ModalHeader>
				<ModalBody pb={6}>
					<Dropzone
						onDropAccepted={(acceptedFile) => {
							handleAttachmentInput(acceptedFile[0]);
						}}
						maxSize={10485760}
						onDropRejected={() => dispatch(setError('File size should be less than 60MB'))}
						multiple={false}
						onError={(err) => {
							dispatch(setError(err.message));
						}}
					>
						{({ getRootProps, getInputProps }) => (
							<Box
								{...getRootProps()}
								borderWidth={'1px'}
								borderColor={'gray'}
								borderStyle={'dashed'}
								borderRadius={'lg'}
								py={'3rem'}
								textAlign={'center'}
								textColor={'gray'}
							>
								<input {...getInputProps()} />
								<Text>Drag and drop file here, or click to select files</Text>
							</Box>
						)}
					</Dropzone>
					{file && <Text mt={'0.5rem'}>Selected file : {file.name}</Text>}
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
						<Button colorScheme='green' mr={3} onClick={handleUploadCSV} isLoading={isSaving}>
							Save
						</Button>
					</HStack>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
});

export default UploadPhonebookDialog;
