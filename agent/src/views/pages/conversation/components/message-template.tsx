import { DownloadIcon } from '@chakra-ui/icons';
import {
	AbsoluteCenter,
	Avatar,
	Box,
	Center,
	Divider,
	Flex,
	HStack,
	Icon,
	Link,
	Text,
	useToast,
} from '@chakra-ui/react';
import { memo, useEffect, useRef, useState } from 'react';
import { BiErrorCircle } from 'react-icons/bi';
import { HiLocationMarker } from 'react-icons/hi';
import { MdOutlinePermMedia } from 'react-icons/md';
import { useInView } from 'react-intersection-observer';
import { useSelector } from 'react-redux';
import { SERVER_URL } from '../../../../config/const';
import MessagesService from '../../../../services/messages.service';
import UploadService from '../../../../services/upload.service';
import { StoreNames, StoreState } from '../../../../store';
import { Contact } from '../../../../store/types/ContactState';
import { Message as TMessage } from '../../../../store/types/MessageState';
import { getFileSize, getFileType } from '../../../../utils/file-utils';
import ContactDrawer, { ContactHandle } from '../../../components/contact-drawer';
import Each from '../../../components/utils/Each';
import Preview from '../../media/preview.component';
import ChatMessageWrapper from './message-wrapper';

type MessageProps = {
	message: TMessage;
};

export const Message = memo(({ message }: MessageProps) => {
	if (message.body?.body_type === 'TEXT') {
		return <TextMessage message={message} />;
	}

	if (message.body?.body_type === 'LOCATION') {
		return <LocationMessage message={message} />;
	}

	if (message.body?.body_type === 'MEDIA') {
		return <MediaMessage message={message} />;
	}

	if (message.body?.body_type === 'CONTACT') {
		return <ContactMessage message={message} />;
	}

	if (message.body?.body_type === 'UNKNOWN') {
		return <UnknownMessage message={message} />;
	}
	return <></>;
});

const TextMessage = ({ message }: { message: TMessage }) => {
	const { selected_device_id } = useSelector((state: StoreState) => state[StoreNames.USER]);

	const [media, setMedia] = useState(initialState);
	const { ref: inViewRef, inView } = useInView({ triggerOnce: true });
	useEffect(() => {
		const showHeader = !!message.header_content;
		const headerIsMedia =
			message.header_type === 'IMAGE' ||
			message.header_type === 'VIDEO' ||
			message.header_type === 'DOCUMENT';
		if (!showHeader || !headerIsMedia) {
			return;
		}
		if (!inView) return;
		MessagesService.getMedia(selected_device_id, message.header_content).then((data) => {
			setMedia({
				showPreview: true,
				loaded: true,
				mimeType: data.mime_type,
				url: data.url,
				size: data.size,
			});
		});
	}, [selected_device_id, inView, message.header_content, message.header_type]);

	const showHeader = !!message.header_content;
	const headerIsMedia =
		message.header_type === 'IMAGE' ||
		message.header_type === 'VIDEO' ||
		message.header_type === 'DOCUMENT';
	const headerIsText = message.header_type === 'TEXT';

	return (
		<ChatMessageWrapper message={message}>
			{showHeader ? (
				headerIsMedia ? (
					<Center width={'98%'} mx={'auto'} ref={inViewRef}>
						<Box hidden={!media.loaded} width={'300px'} mx={'auto'}>
							<Preview
								data={{
									url:
										message.header_content_source === 'ID'
											? `${SERVER_URL}${selected_device_id}/uploads/download-meta-media/${message.header_content}`
											: message.header_content,
									type: getFileType(media.mimeType),
								}}
								progress={-1}
							/>
						</Box>
					</Center>
				) : headerIsText ? (
					<Text fontWeight={'bold'}>{message.header_content}</Text>
				) : null
			) : null}
			<Text whiteSpace={'pre-wrap'}>{message.body?.text}</Text>
			<Text whiteSpace={'pre-wrap'} fontSize={'sm'} textColor={'gray'}>
				{message.footer_content}
			</Text>
		</ChatMessageWrapper>
	);
};

const LocationMessage = ({ message }: { message: TMessage }) => {
	return (
		<ChatMessageWrapper message={message}>
			<Link
				href={`https://www.google.com/maps/search/?q=${message.body?.location?.latitude ?? ''},${
					message.body?.location?.longitude ?? ''
				}`}
				isExternal
			>
				<Text color={'green'}>
					<Icon
						as={HiLocationMarker}
						fontSize={'1.25rem'}
						my={'auto'}
						display={'inline-block'}
						mr={1}
					/>
					Location
				</Text>
				{message.body?.location?.name ? (
					<Text fontWeight={'medium'}>{message.body.location?.name}</Text>
				) : null}
				{message.body?.location?.address ? <Text>{message.body.location?.address}</Text> : null}
				{!message.body?.location?.name && !message.body?.location?.address ? (
					<Text>Open Location</Text>
				) : null}
			</Link>
		</ChatMessageWrapper>
	);
};
const initialState = {
	url: '',
	mimeType: '',
	showPreview: false,
	loaded: false,
	size: 0,
};
const MediaMessage = ({ message }: { message: TMessage }) => {
	const toast = useToast();
	const { selected_device_id } = useSelector((state: StoreState) => state[StoreNames.USER]);
	const [media, setMedia] = useState(initialState);
	const { ref: inViewRef, inView } = useInView({ triggerOnce: true });
	useEffect(() => {
		if (!message.body?.media_id || !selected_device_id) {
			setMedia({
				...initialState,
				loaded: true,
				showPreview: true,
				mimeType: 'file',
			});
			return;
		}
		if (!inView) return;
		MessagesService.getMedia(selected_device_id, message.body?.media_id).then((data) => {
			setMedia({
				...initialState,
				loaded: true,
				mimeType: data.mime_type,
				url: data.url,
				size: data.size,
			});
		});
	}, [message.body?.media_id, selected_device_id, inView]);

	const handleDownload = () => {
		if (!selected_device_id || !message.body?.media_id) {
			return;
		}
		toast.promise(UploadService.downloadMetaMedia(selected_device_id, message.body?.media_id), {
			loading: { title: 'Downloading...' },
			success: { title: 'Downloaded!' },
			error: { title: 'Failed to download' },
		});
	};

	const handlePreview = () => {
		setMedia((prev) => ({ ...prev, showPreview: true }));
	};

	return (
		<ChatMessageWrapper message={message}>
			{!message.body?.media_id ? (
				<Text textAlign={'center'} color={'red.500'} my={'0.5rem'}>
					No Preview Available
				</Text>
			) : !media.loaded ? (
				<Box width={'100%'} ref={inViewRef}>
					<Center
						alignItems={'center'}
						bgColor={'lightgray'}
						width={'260px'}
						aspectRatio={16 / 9}
						rounded={'lg'}
					>
						<MdOutlinePermMedia size={'2.5rem'} color='white' />
					</Center>
				</Box>
			) : !media.showPreview ? (
				<Box width={'100%'} position={'relative'}>
					<Center
						alignItems={'center'}
						bgColor={'lightgray'}
						aspectRatio={16 / 9}
						rounded={'lg'}
						width={'16.25rem'}
					>
						<MdOutlinePermMedia size={'2.5rem'} color='white' />
					</Center>
					<AbsoluteCenter
						bg={'gray'}
						opacity={0.8}
						width={'fit-content'}
						px={'1rem'}
						height={'3.25rem'}
						rounded={'full'}
					>
						<Flex
							gap={2}
							cursor={'pointer'}
							alignItems={'center'}
							justifyContent={'center'}
							height={'full'}
							onClick={handlePreview}
						>
							<Icon as={DownloadIcon} color={'white'} />
							<Text color={'white'}>{getFileSize(media.size)}</Text>
						</Flex>
					</AbsoluteCenter>
				</Box>
			) : (
				// <Image src={media.url} width={'260px'} aspectRatio={16 / 9} rounded={'lg'} />
				<Box
					width={'400px'}
					maxWidth={'100%'}
					aspectRatio={1 / 1}
					position={'relative'}
					marginX={'auto'}
				>
					<Center width={'100%'} mx={'auto'} height={'94%'}>
						<Preview
							data={{
								url: `${SERVER_URL}${selected_device_id}/uploads/download-meta-media/${message.body?.media_id}`,
								type: getFileType(media.mimeType),
							}}
							progress={-1}
						/>
					</Center>
					<Text
						mb='0.5rem'
						textAlign={'center'}
						cursor={'pointer'}
						onClick={handleDownload}
						textDecoration={'underline'}
					>
						Download
					</Text>
				</Box>
			)}
		</ChatMessageWrapper>
	);
};

const ContactMessage = ({ message }: { message: TMessage }) => {
	const contactDrawerRef = useRef<ContactHandle>(null);
	return (
		<Each
			items={message.body?.contacts ?? []}
			render={(contact, index) => (
				<>
					<ChatMessageWrapper message={message}>
						<Box>
							<HStack key={index} direction={'column'} gap={2}>
								<Avatar size={'sm'} name={contact.name?.formatted_name} />
								<Text>{contact.name?.formatted_name}</Text>
							</HStack>
							<Divider orientation='horizontal' my={'0.5rem'} width={'full'} />
							<Text
								fontSize={'sm'}
								cursor={'pointer'}
								textAlign={'center'}
								color={'#009de2'}
								_hover={{ cursor: 'pointer', textDecoration: 'underline' }}
								onClick={() =>
									contactDrawerRef.current?.open({
										contact: { id: '', ...contact } as Contact,
										editable: false,
									})
								}
							>
								View Contact
							</Text>
						</Box>
					</ChatMessageWrapper>
					<ContactDrawer ref={contactDrawerRef} onConfirm={() => {}} />
				</>
			)}
		/>
	);
};

const UnknownMessage = ({ message }: { message: TMessage }) => {
	return (
		<ChatMessageWrapper message={message}>
			<HStack>
				<Icon as={BiErrorCircle} color={'gray.500'} fontSize={'2rem'} />
				<Box>
					<Text fontWeight={'medium'}>Unknown Message Type</Text>
					<Text whiteSpace={'pre-wrap'} fontSize={'sm'}>
						This message cannot be rendered here.
					</Text>
				</Box>
			</HStack>
		</ChatMessageWrapper>
	);
};
