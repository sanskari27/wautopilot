import {
	Button,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Tag,
	TagCloseButton,
	TagLabel,
	Wrap,
	WrapItem,
	useBoolean,
	useToast,
} from '@chakra-ui/react';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useDispatch } from 'react-redux';
import MessagesService from '../../../../services/messages.service';
import { setRecipientLabels } from '../../../../store/reducers/RecipientReducer';
import { Recipient } from '../../../../store/types/RecipientsState';
import LabelFilter from '../../../components/labelFilter';
import Each from '../../../components/utils/Each';

export type AssignConversationLabelDialogHandle = {
	close: () => void;
	open: (recipient: Recipient) => void;
};

const AssignConversationLabelDialog = forwardRef<AssignConversationLabelDialogHandle>((_, ref) => {
	const dispatch = useDispatch();
	const toast = useToast();
	const [isOpen, setOpen] = useBoolean();
	const [newLabel, setNewLabel] = useState('');

	const [isSaving, setIsSaving] = useBoolean();
	const [selected_recipient, setSelectedRecipient] = useState<Recipient>({
		_id: '',
		recipient: '',
		profile_name: '',
		origin: '',
		expiration_timestamp: '',
		labels: [],
	});

	const onClose = () => {
		setSelectedRecipient({
			_id: '',
			recipient: '',
			profile_name: '',
			origin: '',
			expiration_timestamp: '',
			labels: [],
		});
		setOpen.off();
	};

	useImperativeHandle(ref, () => ({
		close: () => {
			onClose();
		},
		open: (recipient: Recipient) => {
			setSelectedRecipient((prev) => {
				return {
					...prev,
					_id: recipient._id,
					recipient: recipient.recipient,
					profile_name: recipient.profile_name,
					origin: recipient.origin,
					expiration_timestamp: recipient.expiration_timestamp,
					labels: recipient.labels,
				};
			});
			setOpen.on();
		},
	}));

	const handleLabelsChange = (labels: string[]) => {
		const selectedLabels = [] as string[];
		labels.forEach((label) => {
			if (!selected_recipient.labels.includes(label)) {
				selectedLabels.push(label);
			}
		});
		setSelectedRecipient((prev) => {
			return {
				...prev,
				labels: [...prev.labels, ...selectedLabels],
			};
		});
	};

	const removeLabel = (label: string) => {
		setSelectedRecipient((prev) => {
			return {
				...prev,
				labels: prev.labels.filter((item) => item !== label),
			};
		});
	};

	const handleSave = async () => {
		setIsSaving.on();

		if (newLabel !== '') {
			newLabel.split(',').forEach((label) => {
				if (!selected_recipient.labels.includes(label.trim())) {
					selected_recipient.labels.push(label.trim());
				}
			});
		}

		// if (selected_recipient.labels.length === 0) {
		// 	toast({
		// 		title: 'Please add at least one label',
		// 		status: 'error',
		// 		duration: 3000,
		// 		isClosable: true,
		// 	});
		// 	setIsSaving.off();
		// 	return;
		// }

		MessagesService.ConversationLabels(selected_recipient.recipient, selected_recipient.labels)
			.then((res) => {
				if (res) {
					toast({
						title: 'Labels assigned successfully',
						status: 'success',
						duration: 3000,
						isClosable: true,
					});
					console.log(selected_recipient.labels, selected_recipient._id);
					dispatch(
						setRecipientLabels({ labels: selected_recipient.labels, id: selected_recipient._id })
					);
					onClose();
					return;
				}
				toast({
					title: 'Failed to assign labels',
					status: 'error',
					duration: 3000,
					isClosable: true,
				});
			})
			.catch(() => {
				toast({
					title: 'Failed to assign labels',
					status: 'error',
					duration: 3000,
					isClosable: true,
				});
			})
			.finally(() => {
				setIsSaving.off();
			});
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size={'2xl'} closeOnOverlayClick={false}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Assign Labels</ModalHeader>
				<ModalBody pb={6}>
					<FormControl pt={'1rem'}>
						<HStack justifyContent={'space-between'}>
							<FormLabel>Tags</FormLabel>
						</HStack>
						<Wrap borderWidth={'1px'} borderColor={'gray.300'} p={'0.5rem'} rounded={'md'}>
							<Each
								items={selected_recipient.labels}
								render={(label) => (
									<WrapItem>
										<Tag borderRadius='full' variant='solid' colorScheme='green'>
											<TagLabel>{label}</TagLabel>
											<TagCloseButton
												onClick={() => {
													removeLabel(label);
												}}
											/>
										</Tag>
									</WrapItem>
								)}
							/>
						</Wrap>
						<Flex>
							<Input
								type='text'
								placeholder='Add new label'
								value={newLabel}
								onChange={(e) => setNewLabel(e.target.value)}
							/>
							<LabelFilter clearOnClose onChange={handleLabelsChange} />
						</Flex>
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

export default AssignConversationLabelDialog;
