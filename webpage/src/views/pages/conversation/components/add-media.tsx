import {
	Box,
	Button,
	Flex,
	HStack,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	VStack,
	useDisclosure,
} from '@chakra-ui/react';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import Dropzone from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import UploadService from '../../../../services/upload.service';
import { StoreNames, StoreState } from '../../../../store';
import { setSaving } from '../../../../store/reducers/MediaReducer';
import {
	removeFile,
	setAttachmentFile,
	setAttachmentName,
	setAttachmentSize,
	setAttachmentType,
	setAttachmentUploading,
	setAttachmentUrl,
	setErrorMessage,
	setMetaAttachmentId,
} from '../../../../store/reducers/MessagesReducers';
import ProgressBar, { ProgressBarHandle } from '../../../components/progress-bar';
import Preview from '../../media/preview.component';

export type AddMediaHandle = {
	open: () => void;
	close: () => void;
};

type AddMediaProps = {
	onConfirm: (mediaId: string) => void;
};

const AddMedia = forwardRef<AddMediaHandle, AddMediaProps>(({ onConfirm }: AddMediaProps, ref) => {
	const dispatch = useDispatch();
	const progressRef = useRef<ProgressBarHandle>(null);

	const { isOpen, onClose, onOpen } = useDisclosure();

	useImperativeHandle(ref, () => ({
		open: () => {
			onOpen();
		},
		close: () => {
			onClose();
		},
	}));

	const {
		message: {
			attachment: { file, name, size, type, url },
		},
		uiDetails: { errorMessage, attachmentUploading },
	} = useSelector((state: StoreState) => state[StoreNames.MESSAGES]);

	const { selected_device_id } = useSelector((state: StoreState) => state[StoreNames.USER]);

	const handleClose = () => {
		dispatch(removeFile());
		dispatch(setSaving(false));
		onClose();
	};

	const handleAttachmentInput = (file: File) => {
		if (file === null) return;
		if (file.size > 62914560)
			return dispatch(setErrorMessage('File size should be less than 60MB'));
		const fileSizeBytes = file.size;

		const fileSizeKB = fileSizeBytes / 1024; // Convert bytes to kilobytes
		const fileSizeMB = fileSizeKB / 1024;

		let type = '';

		if (file.type.includes('image')) {
			type = 'image';
		} else if (file.type.includes('video')) {
			type = 'video';
		} else if (file.type.includes('pdf')) {
			type = 'PDF';
		} else if (file.type.includes('audio')) {
			type = file.type;
		}

		dispatch(setAttachmentFile(file));
		dispatch(
			setAttachmentSize(
				fileSizeMB > 1 ? `${fileSizeMB.toFixed(2)} MB` : `${fileSizeKB.toFixed(2)} KB`
			)
		);
		dispatch(setAttachmentName(file.name));
		dispatch(setAttachmentType(type));
		const url = window.URL.createObjectURL(file);
		dispatch(setAttachmentUrl(url));
	};

	const onUploadProgress = (progressEvent: number) => {
		progressRef.current?.setProgressValue(progressEvent);
	};

	const removeSelectedFile = () => {
		dispatch(removeFile());
	};

	const handleAddAttachment = async () => {
		if (!selected_device_id) return;
		if (!file) {
			dispatch(setErrorMessage('No file selected'));
			return;
		}
		dispatch(setAttachmentUploading(true));
		UploadService.generateMetaMediaId(selected_device_id, file, onUploadProgress)
			.then((res) => {
				dispatch(setMetaAttachmentId(res));
				onConfirm(res);
				handleClose();
			})
			.finally(() => dispatch(setAttachmentUploading(false)));
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size={'xl'}
			closeOnOverlayClick={!attachmentUploading}
			scrollBehavior='inside'
			onCloseComplete={handleClose}
		>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Select Attachment</ModalHeader>
				<ModalBody pb={6}>
					<Box mt={'1.5rem'}>
						{!file ? (
							<>
								<DropzoneElement onFileInput={handleAttachmentInput} isInvalid={!!errorMessage} />
								<Text textAlign={'center'} fontSize={'xs'}>
									*File size should be less than 60MB
								</Text>
							</>
						) : (
							<VStack alignItems={'stretch'} gap='0.5rem'>
								<Text>Selected file : {name}</Text>
								<Flex alignItems={'center'} justifyContent={'space-between'}>
									<Text>Selected file size : {size}</Text>
									<Text
										textColor={'red.400'}
										fontWeight={'normal'}
										cursor={'pointer'}
										onClick={removeSelectedFile}
									>
										Remove
									</Text>
								</Flex>
								<Preview data={{ type, url }} progress={-1} />
							</VStack>
						)}
					</Box>
					{errorMessage && (
						<Text textAlign={'center'} color={'red.500'} fontSize={'sm'} mt={'0.5rem'}>
							{errorMessage}
						</Text>
					)}
					<ProgressBar ref={progressRef} />
				</ModalBody>

				<ModalFooter>
					<HStack width={'full'} justifyContent={'flex-end'}>
						<Button
							onClick={handleClose}
							colorScheme='red'
							variant={'outline'}
							isDisabled={attachmentUploading}
						>
							Cancel
						</Button>
						<Button
							colorScheme='green'
							onClick={handleAddAttachment}
							isLoading={attachmentUploading}
						>
							Send
						</Button>
					</HStack>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
});

export default AddMedia;

function DropzoneElement({
	onFileInput,
	isInvalid,
}: {
	isInvalid: boolean;
	onFileInput: (file: File) => void;
}) {
	const dispatch = useDispatch();
	return (
		<Dropzone
			onDropAccepted={(acceptedFile) => {
				onFileInput(acceptedFile[0]);
			}}
			maxSize={62914560}
			onDropRejected={() => dispatch(setErrorMessage('File size should be less than 60MB'))}
			multiple={false}
			onError={(err) => {
				dispatch(setErrorMessage(err.message));
			}}
		>
			{({ getRootProps, getInputProps }) => (
				<Box
					{...getRootProps()}
					borderWidth={'1px'}
					borderColor={isInvalid ? 'red.500' : 'green.600'}
					borderStyle={'dashed'}
					borderRadius={'lg'}
					py={'3rem'}
					textAlign={'center'}
					textColor={isInvalid ? 'red.300' : 'green.600'}
				>
					<input {...getInputProps()} />
					<Text>Drag and drop file here, or click to select files</Text>
				</Box>
			)}
		</Dropzone>
	);
}
