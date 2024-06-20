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
	Text,
	Textarea,
	useToast,
} from '@chakra-ui/react';
import { ReactNode, useEffect, useRef } from 'react';
import { BiArrowBack, BiSend } from 'react-icons/bi';
import { CiMenuKebab } from 'react-icons/ci';
import { FaFile, FaHeadphones, FaUpload, FaVideo } from 'react-icons/fa';
import { FaPhotoFilm } from 'react-icons/fa6';
import { MdContacts } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { SERVER_URL } from '../../../../config/const';
import MessagesService from '../../../../services/messages.service';
import { StoreNames, StoreState } from '../../../../store';
import {
	addMessage,
	setMessageLabels,
	setMessageList,
	setMessageSending,
	setMessagesLoading,
	setTextMessage,
	updateMessage,
} from '../../../../store/reducers/MessagesReducers';
import { removeUnreadConversation } from '../../../../store/reducers/RecipientReducer';
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
import MessageTagsView, { MessageTagsViewHandle } from './message-tag-view';

type ChatScreenProps = {
	closeChat: () => void;
};

const ChatScreen = ({ closeChat }: ChatScreenProps) => {
	const dispatch = useDispatch();
	const toast = useToast();

	const messageTaggingRef = useRef<MessageTagsViewHandle>(null);

	const { selected_recipient } = useSelector((state: StoreState) => state[StoreNames.RECIPIENT]);
	const { selected_device_id } = useSelector((state: StoreState) => state[StoreNames.USER]);

	const {
		messageList,
		messageLabels,
		uiDetails: { messagesLoading, isMessageSending },
		message: { textMessage },
	} = useSelector((state: StoreState) => state[StoreNames.MESSAGES]);

	// const timeStamp = selected_recipient.expiration_timestamp
	// 	? new Date(selected_recipient.expiration_timestamp)
	// 	: null;
	// const currentTime = new Date();

	const handleMessageInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		e.target.style.height = '5px';
		e.target.style.height = e.target.scrollHeight + 'px';
	};

	useEffect(() => {
		dispatch(setMessagesLoading(true));
		if (!selected_device_id) return;
		MessagesService.fetchConversationMessages(selected_device_id, selected_recipient._id).then(
			(data) => {
				dispatch(removeUnreadConversation(selected_recipient._id));
				dispatch(setMessageList(data.messages));
				dispatch(setMessageLabels(data.messageLabels));
				dispatch(setMessagesLoading(false));

				for (const msg of data.messages) {
					if (msg.received_at) {
						MessagesService.markRead(selected_device_id, msg.message_id);
						break;
					}
				}
			}
		);
	}, [dispatch, selected_device_id, selected_recipient]);

	const sendTextMessage = () => {
		if (!textMessage) return;
		dispatch(setMessageSending(true));
		MessagesService.sendConversationMessage(selected_device_id, selected_recipient._id, {
			type: 'text',
			text: textMessage,
		}).then((data) => {
			dispatch(setMessageSending(false));
			if (!data) {
				return toast({
					title: 'Error',
					description: 'Failed to send message',
					status: 'error',
					duration: 5000,
					isClosable: true,
				});
			}
			dispatch(setTextMessage(''));
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
					<Flex alignItems={'center'}>
						{/* {timeStamp && timeStamp < currentTime ? (
							<Tag colorScheme='green'>Active</Tag>
						) : (
							<Tag colorScheme='red'>Expired</Tag>
						)} */}
						{messagesLoading ? null : (
							<Menu>
								<MenuButton m={0} p={0} as={Button} variant={'unstyled'}>
									<Icon
										mx={'1rem'}
										_hover={{
											cursor: 'pointer',
										}}
										as={CiMenuKebab}
										color='black'
									/>
								</MenuButton>
								<MenuList>
									<MenuItem
										onClick={() => {
											messageTaggingRef.current?.open(messageList, messageLabels);
										}}
									>
										View Messages Tags
									</MenuItem>
								</MenuList>
							</Menu>
						)}
					</Flex>
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
			<MessageTagsView ref={messageTaggingRef} />
		</>
	);
};

const AttachmentSelectorPopover = ({ children }: { children: ReactNode }) => {
	const dispatch = useDispatch();
	const toast = useToast();
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
				dispatch(setMessageList(data.messages));
				dispatch(setMessageLabels(data.messageLabels));
				dispatch(setMessagesLoading(false));
			}
		);
	}, [dispatch, selected_device_id, selected_recipient]);

	useEffect(() => {
		const socket = io(SERVER_URL + 'conversation');

		socket.on('connect', () => {
			socket.emit('join_conversation', selected_recipient._id);
		});

		socket.on('disconnect', () => {});

		socket.on('message_new', (msg) => {
			dispatch(addMessage(msg));
		});

		socket.on('message_updated', (msg) => {
			dispatch(updateMessage({ messageId: msg._id, message: msg }));
		});

		return () => {
			socket.disconnect();
		};
	}, [selected_recipient._id, dispatch]);

	const sendAttachmentMessage = (type: string, attachments: string[]) => {
		if (attachments.length === 0) return;
		for (let i = 0; i < attachments.length; i++) {
			MessagesService.sendConversationMessage(selected_device_id, selected_recipient._id, {
				type: type.toLowerCase() as 'image' | 'video' | 'document' | 'audio',
				media_id: attachments[i],
			});
		}
	};

	const sendContactMessage = (contact: Omit<Contact, 'id' | 'formatted_name'>[]) => {
		dispatch(setMessageSending(true));
		MessagesService.sendConversationMessage(selected_device_id, selected_recipient._id, {
			type: 'contacts',
			contacts: contact,
		}).then((data) => {
			dispatch(setMessageSending(false));
			if (!data) {
				return toast({
					title: 'Error',
					description: 'Failed to send message',
					status: 'error',
					duration: 5000,
					isClosable: true,
				});
			}
		});
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
					sendAttachmentMessage('document', [media_id]);
				}}
			/>
			<ContactSelectorDialog ref={contactDialogHandle} onConfirm={sendContactMessage} />
		</>
	);
};

export default ChatScreen;
