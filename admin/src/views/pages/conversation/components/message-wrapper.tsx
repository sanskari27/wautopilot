import { ChevronDownIcon, PhoneIcon } from '@chakra-ui/icons';
import {
	Button,
	Divider,
	Flex,
	HStack,
	Icon,
	Input,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Tag,
	TagCloseButton,
	TagLabel,
	Text,
	Tooltip,
	VStack,
	Wrap,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import { ReactNode, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { BiCheckDouble, BiLink } from 'react-icons/bi';
import { CgTimer } from 'react-icons/cg';
import { FaReply } from 'react-icons/fa';
import { IoCall } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import useFilterLabels from '../../../../hooks/useFilterLabels';
import MessagesService from '../../../../services/messages.service';
import { StoreNames, StoreState } from '../../../../store';
import { setNewMessageLabels } from '../../../../store/reducers/MessagesReducers';
import { Message } from '../../../../store/types/MessageState';
import LabelFilter from '../../../components/labelFilter';
import Each from '../../../components/utils/Each';

const ChatMessageWrapper = ({ message, children }: { message: Message; children: ReactNode }) => {
	const toast = useToast();
	const assignMessageLabelsRef = useRef<AssignMessageLabelsHandle>(null);
	const isMe = !!message.received_at;

	const scrollToContext = () => {
		if (!message.context || !message.context.id) return;
		const context = document.getElementById(message.context.id);
		if (!context) {
			toast({
				title: 'Message not found',
				description: 'Message might have been deleted or not found in the conversation',
				status: 'error',
			});
			return;
		}
		context?.scrollIntoView({ behavior: 'smooth' });
	};

	return (
		<>
			<Flex
				direction={'column'}
				className='max-w-[80%] md:max-w-[45%]'
				marginBottom={'1rem'}
				alignSelf={isMe ? 'flex-start' : 'flex-end'}
				id={message.message_id}
			>
				<Flex
					direction={'column'}
					bgColor={isMe ? 'white' : '#dcf8c6'}
					paddingLeft={'1rem'}
					paddingRight={'1.6rem'}
					paddingY={'0.5rem'}
					borderTopRadius={'2xl'}
					marginBottom={'0.25rem'}
					borderBottomStartRadius={isMe ? 'none' : '2xl'}
					borderBottomEndRadius={isMe ? '2xl' : 'none'}
					position={'relative'}
					className='group'
				>
					<Menu>
						<MenuButton
							m={0}
							p={0}
							as={Button}
							variant={'unstyled'}
							height={'15px'}
							leftIcon={
								<ChevronDownIcon
									className={`${
										isMe ? '!text-white' : '!text-[#dcf8c6]'
									} group-hover:!text-black transition-none`}
								/>
							}
							textAlign={'right'}
							position={'absolute'}
							right={'0'}
						/>
						<MenuList>
							<MenuItem
								onClick={() => assignMessageLabelsRef.current?.onOpen(message._id, message.labels)}
							>
								Assign Labels
							</MenuItem>
						</MenuList>
						<AssignMessageLabelsDialog ref={assignMessageLabelsRef} />
					</Menu>
					{message.context.id ? (
						<Flex
							borderLeft={isMe ? '2px solid green' : '2px solid white'}
							paddingLeft={'0.5rem'}
							paddingY={'0.25rem'}
							cursor={'pointer'}
							onClick={scrollToContext}
						>
							<Text fontSize={'sm'} color={'gray.500'}>
								Show context
							</Text>
						</Flex>
					) : null}
					{children}
					{message.buttons.length > 0 && (
						<>
							<Divider orientation='horizontal' my={'1rem'} />
							<VStack width={'full'}>
								<Each
									items={message.buttons}
									render={(button, index) => (
										<Button
											width={'full'}
											key={index}
											variant={'outline'}
											colorScheme='green'
											cursor={'pointer'}
											textAlign={'center'}
											py={'0.5rem'}
											leftIcon={
												<Icon
													as={
														button.button_type === 'URL'
															? BiLink
															: button.button_type === 'QUICK_REPLY'
															? FaReply
															: button.button_type === 'PHONE_NUMBER'
															? PhoneIcon
															: IoCall
													}
												/>
											}
											whiteSpace={'pre-wrap'}
											height={'max-content'}
										>
											{button.button_content}
										</Button>
									)}
								/>
							</VStack>
						</>
					)}
				</Flex>
				<Flex
					gap={1}
					alignItems={'center'}
					justifyContent={isMe ? 'flex-start' : 'flex-end'}
					position={'relative'}
				>
					{message.delivered_at && <FormatTime time={message.read_at || message.delivered_at} />}
					{message.received_at && <FormatTime time={message.received_at} />}
					{message.read_at ? (
						<Icon fontSize={'1.25rem'} alignSelf={'flex-end'} as={BiCheckDouble} color='blue.500' />
					) : message.delivered_at ? (
						<Icon fontSize={'1.25rem'} alignSelf={'flex-end'} as={BiCheckDouble} color='gray.500' />
					) : message.failed_at ? (
						<Tooltip label={message.failed_reason}>
							<span>
								<Icon fontSize={'1.25rem'} alignSelf={'flex-end'} as={CgTimer} color='red.500' />
							</span>
						</Tooltip>
					) : // <Icon fontSize={'1.25rem'} alignSelf={'flex-end'} as={CgTimer} color='red.500' />
					!isMe ? (
						<Icon fontSize={'1.25rem'} alignSelf={'flex-end'} as={CgTimer} color='gray.500' />
					) : null}
				</Flex>
			</Flex>
		</>
	);
};

const FormatTime = ({ time }: { time: string }) => {
	const formattedTime =
		new Date(time).getDate() +
		'/' +
		(new Date(time).getMonth() + 1) +
		'/' +
		new Date(time).getFullYear() +
		' ' +
		new Date(time).toLocaleTimeString();
	return (
		<Text textAlign={'right'} fontSize={'xs'}>
			{formattedTime}
		</Text>
	);
};

type AssignMessageLabelsHandle = {
	onOpen: (messageId: string, labels: string[]) => void;
	onClose: () => void;
};

const AssignMessageLabelsDialog = forwardRef<AssignMessageLabelsHandle>((_, ref) => {
	const toast = useToast();
	const dispatch = useDispatch();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { messageLabels } = useSelector((state: StoreState) => state[StoreNames.MESSAGES]);
	const { selected_device_id } = useSelector((state: StoreState) => state[StoreNames.USER]);
	const [messageId, setMessageId] = useState<string>('');

	const [labels, setLabels] = useState<string[]>([]);
	const [newLabels, setNewLabels] = useState<string>('');

	const { onAddLabel, onRemoveLabel, selectedLabels } = useFilterLabels();

	useImperativeHandle(ref, () => ({
		onOpen: (messageId: string, labels: string[]) => {
			setMessageId(messageId);
			setLabels(labels);
			onOpen();
		},
		onClose: () => {
			handleClose();
		},
	}));

	const handleLabelChange = (label: string) => {
		onAddLabel(label);
		setLabels((prev) => {
			if (prev.includes(label)) return prev;
			return [...prev, label];
		});
	};

	const handleRemoveTags = (labels: string) => {
		onRemoveLabel(labels);
		setLabels((prev) => {
			return prev.filter((label) => label !== labels);
		});
	};

	const handleClose = () => {
		onClose();
		setLabels([]);
		setMessageId('');
		setNewLabels('');
	};

	const handleSave = () => {
		if (newLabels !== '') {
			newLabels.split(',').forEach((label) => {
				handleLabelChange(label);
			});
		} // TODO: add handle Text input for labels managed via array jut like phonebook

		toast.promise(
			MessagesService.assignMessageLabels(selected_device_id, messageId, [...labels, newLabels]),
			{
				success: (res) => {
					if (res) {
						dispatch(setNewMessageLabels({ messageId, labels: [...labels, newLabels] }));
					}
					handleClose();
					return {
						title: res ? 'Labels assigned successfully' : 'Failed to assign labels',
						description: res ? 'Please refresh the page to update tags' : 'Please try again later',
						status: res ? 'success' : 'error',
					};
				},
				loading: { title: 'Assigning labels...' },
				error: { title: 'Failed to assign labels' },
			}
		);
	};

	const handleNewLabelInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewLabels(e.target.value);
		const new_label = e.target.value;
		if (new_label.includes(' ')) {
			const label = new_label.split(' ')[0];
			if (!labels.includes(label) && label.trim().length !== 0) {
				setLabels((prev) => [...prev, label]);
			}
			setNewLabels('');
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Assign Labels</ModalHeader>
				<ModalBody>
					<Wrap
						borderWidth={'1px'}
						justifyContent={''}
						gap={'0.5rem'}
						p={'0.5rem'}
						rounded='lg'
						mb={'1rem'}
					>
						{labels.map((label, index) => (
							<Tag key={index}>
								<TagLabel>{label}</TagLabel>
								<TagCloseButton onClick={() => handleRemoveTags(label)} />
							</Tag>
						))}
					</Wrap>
					<HStack>
						<Input
							placeholder='Assign new labels'
							type='text'
							value={newLabels}
							onChange={handleNewLabelInput}
						/>
						<LabelFilter
							onClear={() => setLabels([])}
							labels={messageLabels}
							onAddLabel={handleLabelChange}
							onRemoveLabel={handleRemoveTags}
							selectedLabels={selectedLabels}
						/>
					</HStack>
				</ModalBody>
				<ModalFooter>
					<Button variant={'outline'} colorScheme='red' onClick={handleClose}>
						Cancel
					</Button>
					<Button colorScheme='green' ml={'1rem'} onClick={handleSave}>
						Save
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
});

export default ChatMessageWrapper;
