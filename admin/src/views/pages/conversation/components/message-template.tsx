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
import { RefObject, useEffect, useRef, useState } from 'react';
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
import { Message } from '../../../../store/types/MessageState';
import { getFileSize, getFileType } from '../../../../utils/file-utils';
import ContactDrawer, { ContactHandle } from '../../../components/contact-drawer';
import Each from '../../../components/utils/Each';
import Preview from '../../media/preview.component';
import ChatMessageWrapper from './message-wrapper';

export const TextMessage = ({
	message,
	ref,
	id,
}: {
	message: Message;
	ref: RefObject<HTMLDivElement>;
	id: string;
}) => {
	return (
		<ChatMessageWrapper id={id} ref={ref} message={message}>
			<Text whiteSpace={'pre-wrap'}>{message.body?.text}</Text>
		</ChatMessageWrapper>
	);
};

export const LocationMessage = ({
	message,
	ref,
	id,
}: {
	message: Message;
	ref: RefObject<HTMLDivElement>;
	id: string;
}) => {
	return (
		<ChatMessageWrapper id={id} ref={ref} message={message}>
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
export const MediaMessage = ({
	message,
	ref,
	id,
}: {
	message: Message;
	ref: RefObject<HTMLDivElement>;
	id: string;
}) => {
	const toast = useToast();
	const { selected_device_id } = useSelector((state: StoreState) => state[StoreNames.USER]);
	const [media, setMedia] = useState(initialState);
	const { ref: inViewRef, inView } = useInView({ triggerOnce: true });
	useEffect(() => {
		if (!message.body?.media_id || !selected_device_id) {
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
		<ChatMessageWrapper id={id} ref={ref} message={message}>
			{!media.loaded ? (
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
						className=' w-[200px] md:w-[260px]'
					>
						<MdOutlinePermMedia size={'2.5rem'} color='white' />
					</Center>
					<AbsoluteCenter
						bg={'gray'}
						opacity={0.8}
						width={'fit-content'}
						px={'1rem'}
						height={'50px'}
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
				<Box width={'400px'} height={'420px'} position={'relative'} marginLeft={'-1rem'}>
					<Center width={'97%'} mx={'auto'}>
						<Preview
							data={{
								url: `${SERVER_URL}uploads/${selected_device_id}/download-meta-media/${message.body?.media_id}`,
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

export const ContactMessage = ({
	message,
	ref,
	id,
}: {
	message: Message;
	ref: RefObject<HTMLDivElement>;
	id: string;
}) => {
	const contactDrawerRef = useRef<ContactHandle>(null);
	return (
		<Each
			items={message.body?.contacts ?? []}
			render={(contact, index) => (
				<>
					<ChatMessageWrapper id={id} ref={ref} message={message}>
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

export const UnknownMessage = ({
	message,
	ref,
	id,
}: {
	message: Message;
	ref: RefObject<HTMLDivElement>;
	id: string;
}) => {
	return (
		<ChatMessageWrapper id={id} ref={ref} message={message}>
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
