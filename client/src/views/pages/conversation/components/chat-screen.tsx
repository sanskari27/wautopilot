import { AttachmentIcon } from '@chakra-ui/icons';
import {
	Avatar,
	Box,
	Button,
	Flex,
	HStack,
	Icon,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Tag,
	Text,
	Textarea,
} from '@chakra-ui/react';
import { ReactNode, useEffect, useRef } from 'react';
import { BiArrowBack, BiSend } from 'react-icons/bi';
import { FaFile, FaHeadphones, FaUpload, FaVideo } from 'react-icons/fa';
import { FaPhotoFilm } from 'react-icons/fa6';
import { MdContacts } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import { SERVER_URL } from '../../../../config/const';
import MessagesService from '../../../../services/messages.service';
import { StoreNames, StoreState } from '../../../../store';
import {
	addMessage,
	setMessageList,
	setMessageSending,
	setMessagesLoading,
	setTextMessage,
} from '../../../../store/reducers/MessagesReducers';
import { Contact } from '../../../../store/types/ContactState';
import AttachmentSelectorDialog, {
	AttachmentDialogHandle,
} from '../../../components/selector-dialog/AttachmentSelectorDialog';
import ContactSelectorDialog, {
	ContactSelectorHandle,
} from '../../../components/selector-dialog/ContactSelectorDialog';
import Each from '../../../components/utils/Each';
import AddMedia, { AddMediaHandle } from './add-media';
import ChatMessage from './chat-message';

type ChatScreenProps = {
	closeChat: () => void;
};

const ChatScreen = ({ closeChat }: ChatScreenProps) => {
	const dispatch = useDispatch();
	const { selected_recipient } = useSelector((state: StoreState) => state[StoreNames.RECIPIENT]);
	const { selected_device_id } = useSelector((state: StoreState) => state[StoreNames.USER]);

	const {
		messageList,
		uiDetails: { messagesLoading, isMessageSending },
		message: { textMessage },
	} = useSelector((state: StoreState) => state[StoreNames.MESSAGES]);

	const timeStamp = selected_recipient.expiration_timestamp
		? new Date(selected_recipient.expiration_timestamp)
		: null;
	const currentTime = new Date();

	const handleMessageInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		e.target.style.height = '5px';
		e.target.style.height = e.target.scrollHeight + 'px';
	};

	const sendTextMessage = () => {
		if (!textMessage) return;
		dispatch(setMessageSending(true));
		MessagesService.sendConversationMessage(selected_recipient._id, selected_device_id, {
			type: 'TEXT',
			text: textMessage,
		}).then((data) => {
			console.log(data);
			// dispatch(addMessage(data));
			// dispatch(setTextMessage(''));
			dispatch(setMessageSending(false));
		});
	};

	return (
		<>
			<HStack padding={'1rem'} borderBottomWidth={'2px'} justifyContent={'space-between'}>
				<HStack>
					<Icon as={BiArrowBack} color='black' className='block md:!hidden' onClick={closeChat} />
					<Avatar name={selected_recipient.profile_name} />
					<Box>
						<Text fontWeight={'medium'}>{selected_recipient.profile_name}</Text>
						<Text fontSize={'sm'}>{selected_recipient.recipient}</Text>
					</Box>
				</HStack>
				<HStack>
					{timeStamp && timeStamp < currentTime ? (
						<Tag colorScheme='green'>Active</Tag>
					) : (
						<Tag colorScheme='red'>Expired</Tag>
					)}
				</HStack>
			</HStack>
			<Flex
				height={'calc(100vh - 140px)'}
				width={'full'}
				backgroundColor={'#ece5dd'}
				alignItems={'end'}
				direction={'column'}
			>
				<Flex
					className='flex-col-reverse'
					width={'full'}
					overflowY={'auto'}
					padding={'1rem'}
					height={'full'}
				>
					{messagesLoading ? (
						<Text textAlign={'center'} fontSize={'lg'}>
							Loading Chats...
						</Text>
					) : (
						<Each items={messageList} render={(item) => <ChatMessage message={item} />} />
					)}
				</Flex>
				<HStack bg={'white'} width={'full'} p={'0.5rem'} alignItems={'flex-end'}>
					<AttachmentSelectorPopover>
						<Icon as={AttachmentIcon} bgColor={'transparent'} />
					</AttachmentSelectorPopover>
					<Textarea
						onInput={handleMessageInput}
						maxHeight={'150px'}
						minHeight={'40px'}
						height={'40px'}
						resize={'none'}
						value={textMessage}
						onChange={(e) => dispatch(setTextMessage(e.target.value))}
						placeholder='Type a message'
					/>
					<Button
						colorScheme='green'
						px={'1rem'}
						onClick={sendTextMessage}
						isLoading={isMessageSending}
					>
						<Icon as={BiSend} />
					</Button>
				</HStack>
			</Flex>
		</>
	);
};

const AttachmentSelectorPopover = ({ children }: { children: ReactNode }) => {
	const dispatch = useDispatch();
	const attachmentSelectorHandle = useRef<AttachmentDialogHandle>(null);
	const addMediaHandle = useRef<AddMediaHandle>(null);

	const contactDialogHandle = useRef<ContactSelectorHandle>(null);
	const { selected_device_id } = useSelector((state: StoreState) => state[StoreNames.USER]);
	const {
		message: { attachment_id, contactCard },
	} = useSelector((state: StoreState) => state[StoreNames.MESSAGES]);
	const { selected_recipient } = useSelector((state: StoreState) => state[StoreNames.RECIPIENT]);

	useEffect(() => {
		dispatch(setMessagesLoading(true));
		if (!selected_device_id) return;
		MessagesService.fetchConversationMessages(selected_device_id, selected_recipient._id).then(
			(data) => {
				dispatch(setMessageList(data));
				dispatch(setMessagesLoading(false));
			}
		);
	}, [dispatch, selected_device_id, selected_recipient]);

	useEffect(() => {
		const socket = io(SERVER_URL + 'conversation');

		socket.on('connect', () => {
			socket.emit('join_conversation', selected_recipient._id);
			console.log('Connected to the server');
		});

		socket.on('disconnect', () => {
			console.log('Disconnected from the server');
		});

		socket.on('new_message', (msg) => {
			dispatch(addMessage(msg));
		});

		return () => {
			socket.disconnect();
		};
	}, [selected_recipient._id, dispatch]);

	const sendAttachmentMessage = (attachment: string[]) => {
		if (attachment.length === 0) return;
		console.log(attachment);
		// MessagesService.sendConversationMessage(selected_recipient._id, selected_device_id, {
		// 	type: 'MEDIA',
		// 	media_id: attachment,
		// }).then((data) => {
		// 	console.log(data);
		// 	// dispatch(addMessage(data));
		// });
	};

	const sendContactMessage = (contact: Omit<Contact, 'id' | 'formatted_name'>[]) => {
		console.log(contact);
		// MessagesService.sendConversationMessage(selected_recipient._id, selected_device_id, {
		// 	type: 'CONTACT',
		// 	contacts: contact,
		// }).then((data) => {
		// 	console.log(data);
		// 	// dispatch(addMessage(data));
		// });
	};

	return (
		<>
			<Menu>
				<MenuButton bg={'transparent'} p={0} as={Button}>
					{children}
				</MenuButton>
				<MenuList>
					<MenuItem
						rounded={'none'}
						width={'full'}
						justifyContent={'flex-start'}
						onClick={() =>
							attachmentSelectorHandle.current?.open({ ids: attachment_id, type: 'DOCUMENT' })
						}
					>
						<Flex gap={2} alignItems={'center'}>
							<Icon as={FaFile} />
							<Text>Documents</Text>
						</Flex>
					</MenuItem>
					<MenuItem
						rounded={'none'}
						width={'full'}
						justifyContent={'flex-start'}
						onClick={() =>
							attachmentSelectorHandle.current?.open({ ids: attachment_id, type: 'PHOTOS' })
						}
					>
						<Flex gap={2} alignItems={'center'}>
							<Icon as={FaPhotoFilm} />
							<Text>Photos</Text>
						</Flex>
					</MenuItem>
					<MenuItem
						rounded={'none'}
						width={'full'}
						justifyContent={'flex-start'}
						onClick={() =>
							attachmentSelectorHandle.current?.open({ ids: attachment_id, type: 'VIDEO' })
						}
					>
						<Flex gap={2} alignItems={'center'}>
							<Icon as={FaVideo} />
							<Text>Video</Text>
						</Flex>
					</MenuItem>
					<MenuItem
						rounded={'none'}
						width={'full'}
						justifyContent={'flex-start'}
						onClick={() =>
							attachmentSelectorHandle.current?.open({ ids: attachment_id, type: 'AUDIO' })
						}
					>
						<Flex gap={2} alignItems={'center'}>
							<Icon as={FaHeadphones} />
							<Text>Audio</Text>
						</Flex>
					</MenuItem>
					<MenuItem
						rounded={'none'}
						width={'full'}
						justifyContent={'flex-start'}
						onClick={() => contactDialogHandle.current?.open(contactCard)}
					>
						<Flex gap={2} alignItems={'center'}>
							<Icon as={MdContacts} />
							<Text>Contact Card</Text>
						</Flex>
					</MenuItem>
					<MenuItem
						rounded={'none'}
						width={'full'}
						justifyContent={'flex-start'}
						onClick={() => addMediaHandle.current?.open()}
					>
						<Flex gap={2} alignItems={'center'}>
							<Icon as={FaUpload} />
							<Text>Upload File</Text>
						</Flex>
					</MenuItem>
				</MenuList>
			</Menu>

			<AttachmentSelectorDialog ref={attachmentSelectorHandle} onConfirm={sendAttachmentMessage} />
			<AddMedia
				ref={addMediaHandle}
				onConfirm={(media_id) => {
					console.log(media_id);
					sendAttachmentMessage([media_id]);
				}}
			/>
			<ContactSelectorDialog ref={contactDialogHandle} onConfirm={sendContactMessage} />
		</>
	);
};

export default ChatScreen;
