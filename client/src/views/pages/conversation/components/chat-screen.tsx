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
import { ReactNode, useRef } from 'react';
import { BiArrowBack, BiSend } from 'react-icons/bi';
import { FaFile, FaHeadphones, FaUpload, FaVideo } from 'react-icons/fa';
import { FaPhotoFilm } from 'react-icons/fa6';
import { MdContacts } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { StoreNames, StoreState } from '../../../../store';
import { setTextMessage } from '../../../../store/reducers/MessagesReducers';
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
	const { selected_recipient } = useSelector((state: StoreState) => state[StoreNames.RECIPIENT]);
	const dispatch = useDispatch();

	const {
		messageList,
		uiDetails: { messagesLoading },
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
					<Button colorScheme='green' px={'1rem'} onClick={() => console.log(textMessage)}>
						<Icon as={BiSend} />
					</Button>
				</HStack>
			</Flex>
		</>
	);
};

const AttachmentSelectorPopover = ({ children }: { children: ReactNode }) => {
	const attachmentSelectorHandle = useRef<AttachmentDialogHandle>(null);
	const addMediaHandle = useRef<AddMediaHandle>(null);

	const contactDialogHandle = useRef<ContactSelectorHandle>(null);
	const {
		message: { attachment_id, contactCard },
	} = useSelector((state: StoreState) => state[StoreNames.MESSAGES]);

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

			<AttachmentSelectorDialog
				ref={attachmentSelectorHandle}
				onConfirm={(attachment) => console.log(attachment)}
			/>
			<AddMedia ref={addMediaHandle} />
			<ContactSelectorDialog
				ref={contactDialogHandle}
				onConfirm={(contact) => console.log(contact)}
			/>
		</>
	);
};

export default ChatScreen;
