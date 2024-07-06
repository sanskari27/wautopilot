import { CloseIcon } from '@chakra-ui/icons';
import {
	Button,
	HStack,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Tag,
	TagLabel,
	TagRightIcon,
	Text,
	Wrap,
	useBoolean,
	useToast,
} from '@chakra-ui/react';
import { forwardRef, useImperativeHandle } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFetchLabels } from '../../../../hooks/useFetchLabels';
import PhoneBookService from '../../../../services/phonebook.service';
import { StoreNames, StoreState } from '../../../../store';
import {
	addCSVLabel,
	removeCSVLabels,
	setCSVLabels,
	setFile,
} from '../../../../store/reducers/PhonebookReducer';
import LabelFilter from '../../../components/labelFilter';
import Each from '../../../components/utils/Each';
import Show from '../../../components/utils/Show';

export type AssignLabelDialogHandle = {
	close: () => void;
	open: () => void;
};

const AssignLabelDialog = forwardRef<AssignLabelDialogHandle>((_, ref) => {
	const dispatch = useDispatch();
	const toast = useToast();
	const [isOpen, setOpen] = useBoolean();

	const { all_labels } = useFetchLabels();
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

	const handleAddLabels = (label: string) => {
		dispatch(addCSVLabel(label));
	};

	const handleRemoveLabels = (label: string) => {
		dispatch(removeCSVLabels(label));
	};

	const handleClearLabels = () => {
		dispatch(setCSVLabels([]));
	};

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
					<Wrap
						width={'full'}
						borderWidth={'2px'}
						minH={'38px'}
						rounded={'lg'}
						borderStyle={'dashed'}
						p={'0.5rem'}
					>
						<Show>
							<Show.When condition={labels.length === 0}>
								<Text width={'full'} textAlign={'center'}>
									No labels selected
								</Text>
							</Show.When>
							<Show.Else>
								<Each
									items={labels}
									render={(label) => (
										<Tag variant='outline' colorScheme='green' size={'sm'}>
											<TagLabel>{label}</TagLabel>
											<TagRightIcon
												cursor={'pointer'}
												as={CloseIcon}
												onClick={() => handleRemoveLabels(label)}
											/>
										</Tag>
									)}
								/>
							</Show.Else>
						</Show>
					</Wrap>

					<LabelFilter
						labels={all_labels}
						selectedLabels={labels}
						onAddLabel={handleAddLabels}
						onRemoveLabel={handleRemoveLabels}
						onClear={handleClearLabels}
						buttonComponent={
							<Button colorScheme='green' size={'sm'} width={'full'} mt={'1rem'}>
								Select Labels
							</Button>
						}
					/>
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
