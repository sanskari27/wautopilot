import {
	Box,
	Button,
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	HStack,
	IconButton,
	Input,
	InputGroup,
	InputRightAddon,
	InputRightElement,
	Tag,
	TagCloseButton,
	TagLabel,
	Text,
	VStack,
	Wrap,
	WrapItem,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import { forwardRef, useImperativeHandle } from 'react';
import { MdRemove } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useFetchLabels } from '../../../../hooks/useFetchLabels';
import useFilterLabels from '../../../../hooks/useFilterLabels';
import PhoneBookService from '../../../../services/phonebook.service';
import { StoreNames, StoreState } from '../../../../store';
import {
	addDetailsLabel,
	addLabelInput,
	clearDetails,
	removeDetailsLabel,
	removeOtherKey,
	setAnniversary,
	setBirthday,
	setEmail,
	setError,
	setFirstName,
	setLastName,
	setMiddleName,
	setOthers,
	setPhoneNumber,
	setSalutation,
	setSaving,
} from '../../../../store/reducers/PhonebookReducer';
import LabelFilter from '../../../components/labelFilter';
import Each from '../../../components/utils/Each';

export type ContactInputDialogHandle = {
	open: () => void;
	close: () => void;
};

export type ContactInputDialogProps = {
	onSave?: () => void;
};

const ContactInputDialog = forwardRef<ContactInputDialogHandle,ContactInputDialogProps>(({onSave}, ref) => {
	const dispatch = useDispatch();
	const toast = useToast();

	const { isOpen, onOpen, onClose } = useDisclosure();

	useImperativeHandle(ref, () => ({
		open: () => {
			onOpen();
		},
		close: () => {
			onClose();
		},
	}));

	const { details, uiDetails, label_input } = useSelector(
		(state: StoreState) => state[StoreNames.PHONEBOOK]
	);
	const {
		salutation,
		first_name,
		last_name,
		middle_name,
		phone_number,
		email,
		birthday,
		anniversary,
		others,
		id,
		labels,
	} = details;

	const { selectedLabels, onAddLabel, onClear, onRemoveLabel } = useFilterLabels();

	const { all_labels } = useFetchLabels();

	const { error, isSaving } = uiDetails;

	const handleClose = () => {
		dispatch(clearDetails());
		onClose();
	};

	const handleClearContactCard = () => {
		dispatch(clearDetails());
	};

	const handleAddLabel = (label: string) => {
		onAddLabel(label);
		dispatch(addDetailsLabel(label));
	};

	const handleRemoveLabel = (label: string) => {
		onRemoveLabel(label);
		dispatch(removeDetailsLabel(label));
	};

	const handleSave = () => {
		dispatch(setError(''));
		dispatch(setSaving(true));

		const promise = id
			? PhoneBookService.updateRecord(id, details)
			: PhoneBookService.addRecord(details);

		toast.promise(promise, {
			success: () => {
				dispatch(setSaving(false));
				onSave && onSave();
				handleClose();
				return {
					title: 'Record saved successfully',
					description: 'Please refresh the page to see the changes.',
				};
			},
			error: (err) => {
				dispatch(setSaving(false));
				return {
					title: 'Failed to save record.',
					description: err.message,
				};
			},
			loading: {
				title: 'Saving record',
				description: 'Please wait',
			},
		});
	};

	return (
		<Drawer
			isOpen={isOpen}
			placement='right'
			onClose={onClose}
			size={'lg'}
			onCloseComplete={handleClose}
		>
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton onClick={handleClearContactCard} />
				<DrawerHeader>Phonebook Record</DrawerHeader>

				<DrawerBody>
					<VStack width={'full'} alignItems={'stretch'} gap={4}>
						<Box>
							<Text>Prefix</Text>
							<Input
								placeholder='Mr. Mrs. Dr. etc.'
								type='text'
								onChange={(e) => dispatch(setSalutation(e.target.value))}
								value={salutation ?? ''}
							/>
						</Box>
						<Box>
							<Text>First name</Text>
							<Input
								placeholder='First name'
								type='text'
								onChange={(e) => dispatch(setFirstName(e.target.value))}
								value={first_name ?? ''}
							/>
						</Box>
						<HStack>
							<Box width={'full'}>
								<Text>Middle name</Text>
								<Input
									placeholder='Middle name'
									type='text'
									value={middle_name ?? ''}
									onChange={(e) => dispatch(setMiddleName(e.target.value))}
								/>
							</Box>
							<Box width={'full'}>
								<Text>Last name</Text>
								<Input
									placeholder='Last name'
									type='text'
									value={last_name ?? ''}
									onChange={(e) => dispatch(setLastName(e.target.value))}
								/>
							</Box>
						</HStack>
						<Box>
							<Text>Email</Text>
							<Input
								placeholder='Email'
								type='email'
								value={email ?? ''}
								onChange={(e) => dispatch(setEmail(e.target.value))}
							/>
						</Box>

						<Box>
							<Text>Phone Number</Text>
							<InputGroup bgColor={'transparent'} borderWidth={'1px'} rounded={'md'}>
								<Input
									type='tel'
									placeholder='Phone number with country code'
									value={phone_number ?? ''}
									onChange={(e) => dispatch(setPhoneNumber(e.target.value))}
								/>
							</InputGroup>
						</Box>
						<Box>
							<Text>Birthday</Text>
							<InputGroup bgColor={'transparent'} borderWidth={'1px'} rounded={'md'}>
								<Input
									type='date'
									value={birthday ?? ''}
									onChange={(e) => dispatch(setBirthday(e.target.value))}
								/>
							</InputGroup>
						</Box>
						<Box>
							<Text>Anniversary</Text>
							<InputGroup bgColor={'transparent'} borderWidth={'1px'} rounded={'md'}>
								<Input
									type='date'
									value={anniversary ?? ''}
									onChange={(e) => dispatch(setAnniversary(e.target.value))}
								/>
							</InputGroup>
						</Box>
						<Box>
							<Text>Tags</Text>
							<Wrap borderWidth={'1px'} borderColor={'gray.300'} p={'0.5rem'} rounded={'md'}>
								<Each
									items={labels}
									render={(label) => (
										<WrapItem>
											<Tag borderRadius='full' variant='solid' colorScheme='green'>
												<TagLabel>{label}</TagLabel>
												<TagCloseButton onClick={() => handleRemoveLabel(label)} />
											</Tag>
										</WrapItem>
									)}
								/>
							</Wrap>
							<InputGroup bgColor={'transparent'} borderWidth={'1px'} rounded={'md'}>
								<Input
									type='text'
									placeholder='Enter tag'
									value={label_input}
									onChange={(e) => dispatch(addLabelInput(e.target.value))}
								/>
								<InputRightAddon px={0}>
									<LabelFilter
										labels={all_labels}
										onAddLabel={(label) => handleAddLabel(label)}
										onRemoveLabel={(label) => handleRemoveLabel(label)}
										onClear={onClear}
										selectedLabels={selectedLabels}
									/>
								</InputRightAddon>
							</InputGroup>
						</Box>

						<Each
							items={Object.keys(others)}
							render={(key) => (
								<Box width={'full'}>
									<Text>{key}</Text>
									<InputGroup bgColor={'transparent'} borderWidth={'1px'} rounded={'md'}>
										<Input
											placeholder={`Enter ${key} value`}
											type='text'
											value={others[key] ?? ''}
											onChange={(e) => dispatch(setOthers({ key, value: e.target.value }))}
										/>
										<InputRightElement>
											<IconButton
												aria-label='Remove field'
												icon={<MdRemove />}
												h='1.75rem'
												size='sm'
												onClick={() => dispatch(removeOtherKey(key))}
											/>
										</InputRightElement>
									</InputGroup>
								</Box>
							)}
						/>
					</VStack>
				</DrawerBody>

				<DrawerFooter width={'full'} justifyContent={'space-between'}>
					<Text textColor='tomato'>{error ? error : ''}</Text>
					<HStack>
						<Button variant='outline' colorScheme='red' mr={3} onClick={handleClose}>
							Cancel
						</Button>
						<Button isLoading={isSaving} colorScheme='green' onClick={handleSave}>
							Save
						</Button>
					</HStack>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
});

export default ContactInputDialog;
