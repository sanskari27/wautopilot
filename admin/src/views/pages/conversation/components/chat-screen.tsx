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
	useToast,
} from '@chakra-ui/react';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { BiArrowBack, BiSend } from 'react-icons/bi';
import { CiMenuKebab } from 'react-icons/ci';
import { FaFile, FaHeadphones, FaUpload, FaVideo } from 'react-icons/fa';
import { FaPhotoFilm } from 'react-icons/fa6';
import { MdContacts, MdQuickreply } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import MessagesService from '../../../../services/messages.service';
import { StoreNames, StoreState } from '../../../../store';
import {
	addMessageList,
	setMessageLabels,
	setMessageList,
	setMessageSending,
	setMessagesLoading,
	setTextMessage,
} from '../../../../store/reducers/MessagesReducers';
import { removeUnreadConversation, setExpiry } from '../../../../store/reducers/RecipientReducer';
import { Contact } from '../../../../store/types/ContactState';
import AttachmentSelectorDialog, {
	AttachmentDialogHandle,
} from '../../../components/selector-dialog/AttachmentSelectorDialog';
import ContactSelectorDialog, {
	ContactSelectorHandle,
} from '../../../components/selector-dialog/ContactSelectorDialog';
import AddMedia, { AddMediaHandle } from './add-media';
import MessageTagsView, { MessageTagsViewHandle } from './message-tag-view';
import { default as MessagesList } from './MessagesList';
import QuickReplyDialog, { QuickReplyHandle } from './QuickReplyDialog';

type ChatScreenProps = {
	closeChat: () => void;
};

const ChatScreen = ({ closeChat }: ChatScreenProps) => {
	const dispatch = useDispatch();

	const messageTaggingRef = useRef<MessageTagsViewHandle>(null);
	const pagination = useRef({
		page: 1,
		loadMore: true,
		lastFetched: {
			page: 1,
			recipient_id: '',
		},
	});
	const { selected_recipient } = useSelector((state: StoreState) => state[StoreNames.RECIPIENT]);
	const { selected_device_id } = useSelector((state: StoreState) => state[StoreNames.USER]);

	const {
		messageList,
		uiDetails: { messagesLoading },
	} = useSelector((state: StoreState) => state[StoreNames.MESSAGES]);

	// const timeStamp = selected_recipient.expiration_timestamp
	// 	? new Date(selected_recipient.expiration_timestamp)
	// 	: null;
	// const currentTime = new Date();

	useEffect(() => {
		if (!selected_device_id || !selected_recipient) return;
		if (
			pagination.current.lastFetched.recipient_id === selected_recipient._id &&
			pagination.current.lastFetched.page === 1
		) {
			return;
		}
		const abortController = new AbortController();
		pagination.current.loadMore = true;
		pagination.current.page = 1;
		dispatch(setMessagesLoading(true));
		dispatch(setMessageList([]));

		MessagesService.fetchConversationMessages(selected_device_id, selected_recipient._id, {
			page: 1,
			signal: abortController.signal,
		}).then((data) => {
			dispatch(removeUnreadConversation(selected_recipient._id));
			dispatch(setMessageList(data.messages));
			dispatch(setExpiry(data.expiry));
			dispatch(setMessageLabels(data.messageLabels));
			dispatch(setMessagesLoading(false));
			if (data.messages.length < 50) {
				pagination.current.loadMore = false;
			}
			pagination.current.lastFetched.page = 1;
			pagination.current.lastFetched.recipient_id = selected_recipient._id;
		});

		return () => {
			abortController.abort();
		};
	}, [dispatch, selected_device_id, selected_recipient]);

	const loadMore = () => {
		if (!pagination.current.loadMore) {
			return;
		} else if (
			pagination.current.lastFetched.recipient_id === selected_recipient._id &&
			pagination.current.lastFetched.page === pagination.current.page
		) {
			return;
		}

		pagination.current.page++;
		dispatch(setMessagesLoading(true));
		MessagesService.fetchConversationMessages(selected_device_id, selected_recipient._id, {
			page: pagination.current.page,
		}).then((data) => {
			dispatch(addMessageList(data.messages));
			dispatch(setMessagesLoading(false));
			if (data.messages.length < 50) {
				pagination.current.loadMore = false;
			}
			pagination.current.lastFetched.page = 1;
			pagination.current.lastFetched.recipient_id = selected_recipient._id;
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
						{selected_recipient.expiry && (
							<ExpiryCountdown
								timeLeft={selected_recipient.expiry === 'EXPIRED' ? 0 : selected_recipient.expiry}
							/>
						)}
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
											messageTaggingRef.current?.open();
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
				{messagesLoading && (
					<Text width={'full'} textAlign={'center'} fontSize={'lg'}>
						loading...
					</Text>
				)}
				<Flex
					className='flex-col-reverse'
					width={'full'}
					overflowY={'auto'}
					padding={'1rem'}
					height={'full'}
				>
					<MessagesList list={messageList} onLastReached={loadMore} />
				</Flex>
				<MessageBox />
			</Flex>
			<MessageTagsView ref={messageTaggingRef} />
		</>
	);
};

function MessageBox() {
	const toast = useToast();
	const dispatch = useDispatch();

	const { selected_recipient } = useSelector((state: StoreState) => state[StoreNames.RECIPIENT]);
	const { selected_device_id } = useSelector((state: StoreState) => state[StoreNames.USER]);

	const {
		uiDetails: { isMessageSending },
		message: { textMessage },
	} = useSelector((state: StoreState) => state[StoreNames.MESSAGES]);

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

	const handleMessageInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		e.target.style.height = '5px';
		e.target.style.height = e.target.scrollHeight + 'px';
	};
	return (
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
	);
}

const AttachmentSelectorPopover = ({ children }: { children: ReactNode }) => {
	const dispatch = useDispatch();
	const toast = useToast();
	const attachmentSelectorHandle = useRef<AttachmentDialogHandle>(null);
	const addMediaHandle = useRef<AddMediaHandle>(null);
	const quickReplyRef = useRef<QuickReplyHandle>(null);

	const contactDialogHandle = useRef<ContactSelectorHandle>(null);
	const { selected_device_id } = useSelector((state: StoreState) => state[StoreNames.USER]);
	const {
		message: { attachment_id, contactCard },
	} = useSelector((state: StoreState) => state[StoreNames.MESSAGES]);
	const { selected_recipient } = useSelector((state: StoreState) => state[StoreNames.RECIPIENT]);

	const sendAttachmentMessage = (type: string, attachments: string[]) => {
		if (attachments.length === 0) return;
		
		const _type = type === 'PHOTOS' ? 'image' : type.toLowerCase();

		for (let i = 0; i < attachments.length; i++) {
			MessagesService.sendConversationMessage(selected_device_id, selected_recipient._id, {
				type: _type as 'image' | 'video' | 'document' | 'audio',
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
					<MenuItem
						rounded={'none'}
						width={'full'}
						justifyContent={'flex-start'}
						onClick={() => quickReplyRef.current?.open()}
					>
						<Flex gap={2} alignItems={'center'}>
							<Icon as={MdQuickreply} />
							<Text>Quick Reply</Text>
						</Flex>
					</MenuItem>
				</MenuList>
			</Menu>

			<AttachmentSelectorDialog
				ref={attachmentSelectorHandle}
				onConfirm={sendAttachmentMessage}
				returnType='media_id'
				selectButtonText='Send'
				isMultiSelect
			/>
			<AddMedia
				ref={addMediaHandle}
				onConfirm={(media_id) => {
					sendAttachmentMessage('document', [media_id]);
				}}
			/>
			<ContactSelectorDialog ref={contactDialogHandle} onConfirm={sendContactMessage} />
			<QuickReplyDialog ref={quickReplyRef} />
		</>
	);
};

const ExpiryCountdown = ({ timeLeft }: { timeLeft: number }) => {
	const [_timeLeft, setTimeLeft] = useState(timeLeft);

	useEffect(() => {
		const interval = setInterval(() => {
			setTimeLeft((prev) => prev - 1);
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		setTimeLeft(timeLeft);
	}, [timeLeft]);

	const formatTime = (time: number) => {
		const hours = Math.floor(time / 3600);
		const minutes = Math.floor((time % 3600) / 60);
		const seconds = time % 60;
		return `${hours > 0 ? hours + 'h ' : ''}${minutes > 0 ? minutes + 'm ' : ''}${seconds}s`;
	};

	return (
		<>
			{_timeLeft <= 0 ? (
				<Tag colorScheme='red'>Expired</Tag>
			) : (
				<Tag colorScheme='green'>Expires In :- {formatTime(_timeLeft)} </Tag>
			)}
		</>
	);
};

export default ChatScreen;
