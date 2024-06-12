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
	useToast,
} from '@chakra-ui/react';
import { useRef } from 'react';
import Dropzone from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { NAVIGATION } from '../../../config/const';
import MediaService from '../../../services/media.service';
import { StoreNames, StoreState } from '../../../store';
import {
	addMedia,
	removeFile,
	setError,
	setFile,
	setSaving,
} from '../../../store/reducers/MediaReducer';
import ProgressBar, { ProgressBarHandle } from '../../components/progress-bar';
import Preview from './preview.component';

export default function AddMedia() {
	const dispatch = useDispatch();
	const toast = useToast();
	const navigate = useNavigate();
	const progressRef = useRef<ProgressBarHandle>(null);

	const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });

	const { selected_device_id } = useSelector((state: StoreState) => state[StoreNames.USER]);

	const { file, uiDetails, size, type, url } = useSelector(
		(state: StoreState) => state[StoreNames.MEDIA]
	);

	const { isSaving, error } = uiDetails;

	const handleClose = () => {
		dispatch(removeFile());
		dispatch(setSaving(false));
		navigate(`${NAVIGATION.APP}/${NAVIGATION.MEDIA}`);
	};

	const handleAttachmentInput = (file: File) => {
		if (file === null) return;
		if (file.size > 62914560) return dispatch(setError('File size should be less than 60MB'));
		const url = window.URL.createObjectURL(file);
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

		dispatch(
			setFile({
				file,
				type,
				size: fileSizeMB > 1 ? `${fileSizeMB.toFixed(2)} MB` : `${fileSizeKB.toFixed(2)} KB`,
				url,
			})
		);
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
			dispatch(setError('FILE'));
			return;
		}
		dispatch(setSaving(true));
		toast.promise(MediaService.uploadMedia(selected_device_id, file, onUploadProgress), {
			success: (res) => {
				dispatch(addMedia(res));
				dispatch(setSaving(false));
				handleClose();
				return {
					title: 'Uploaded',
					description: 'Media uploaded successfully',
					status: 'success',
					duration: 5000,
					isClosable: true,
				};
			},
			error: () => {
				dispatch(setSaving(false));
				return {
					title: 'Error',
					description: 'Error while uploading media',
					status: 'error',
					duration: 5000,
					isClosable: true,
				};
			},
			loading: {
				title: 'Uploading media...',
			},
		});
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size={'xl'}
			closeOnOverlayClick={!isSaving}
			scrollBehavior='inside'
			onCloseComplete={handleClose}
		>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Upload Media</ModalHeader>
				<ModalBody pb={6}>
					<Box mt={'1.5rem'}>
						{!file ? (
							<>
								<DropzoneElement onFileInput={handleAttachmentInput} isInvalid={error === 'FILE'} />
								<Text textAlign={'center'} fontSize={'xs'}>
									*File size should be less than 60MB
								</Text>
							</>
						) : (
							<VStack alignItems={'stretch'} gap='0.5rem'>
								<Text>Selected file : {file.name}</Text>
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
					<ProgressBar ref={progressRef} />
				</ModalBody>

				<ModalFooter>
					<HStack width={'full'} justifyContent={'flex-end'}>
						<Button
							onClick={handleClose}
							colorScheme='red'
							variant={'outline'}
							isDisabled={isSaving}
						>
							Cancel
						</Button>
						<Button colorScheme='green' onClick={handleAddAttachment} isLoading={isSaving}>
							Save
						</Button>
					</HStack>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

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
