import Each from '@/components/containers/each';
import ContactDialog from '@/components/elements/dialogs/contact';
import PreviewFile from '@/components/elements/preview-file';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import useBoolean from '@/hooks/useBoolean';
import { SERVER_URL } from '@/lib/consts';
import { getFileSize, getFileType, getInitials } from '@/lib/utils';
import { Contact } from '@/schema/phonebook';
import { Message as TMessage } from '@/types/recipient';
import { ArrowDownToLine, ShieldX } from 'lucide-react';
import Link from 'next/link';
import { memo, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { MdOutlinePermMedia } from 'react-icons/md';
import { useInView } from 'react-intersection-observer';
import MessagesService from '../../../../services/messages.service';
import UploadService from '../../../../services/upload.service';
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

Message.displayName = 'Message';

const TextMessage = ({ message }: { message: TMessage }) => {
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
		MessagesService.getMedia(message.header_content).then((data) => {
			setMedia({
				showPreview: true,
				loaded: true,
				mimeType: data.mime_type,
				url: data.url,
				size: data.size,
			});
		});
	}, [inView, message.header_content, message.header_type]);

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
					<div className='flex items-center mx-auto w-[98%]' ref={inViewRef}>
						<div className='w-[300px] mx-auto' hidden={!media.loaded}>
							<PreviewFile
								data={{
									url:
										message.header_content_source === 'ID'
											? `${SERVER_URL}uploads/download-meta-media/${message.header_content}`
											: message.header_content,
									type: getFileType(media.mimeType),
								}}
							/>
						</div>
					</div>
				) : headerIsText ? (
					<p className='font-bold'>{message.header_content}</p>
				) : null
			) : null}
			<p className='whitespace-pre-wrap'>{message.body?.text}</p>
			<p className='whitespace-pre-wrap text-sm text-gray-600'>{message.footer_content}</p>
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
				target='_blank'
			>
				<p className='text-primary'>
					<ArrowDownToLine className='w-5 h-5 text-primary my-auto inline-block mr-1' />
					Location
				</p>
				{message.body?.location?.name ? (
					<p className='font-medium'>{message.body.location?.name}</p>
				) : null}
				{message.body?.location?.address ? <p>{message.body.location?.address}</p> : null}
				{!message.body?.location?.name && !message.body?.location?.address ? (
					<p>Open Location</p>
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
	const [media, setMedia] = useState(initialState);
	const { ref: inViewRef, inView } = useInView({ triggerOnce: true });
	useEffect(() => {
		if (!message.body?.media_id) {
			setMedia({
				loaded: true,
				showPreview: true,
				mimeType: 'file',
				size: 0,
				url: '',
			});
			return;
		}
		if (!inView) return;
		MessagesService.getMedia(message.body?.media_id).then((data) => {
			setMedia({
				showPreview: false,
				loaded: true,
				mimeType: data.mime_type,
				url: data.url,
				size: data.size,
			});
		});
	}, [message.body?.media_id, inView]);

	const handleDownload = () => {
		if (!message.body?.media_id) {
			return;
		}
		toast.promise(UploadService.downloadMetaMedia(message.body?.media_id), {
			loading: 'Downloading...',
			success: 'Downloaded!',
			error: 'Failed to download',
		});
	};

	const handlePreview = () => {
		setMedia((prev) => ({ ...prev, showPreview: true }));
	};

	return (
		<ChatMessageWrapper message={message}>
			{!message.body?.media_id ? (
				<p className='text-center text-destructive my-2'>No Preview Available</p>
			) : !media.loaded ? (
				<div className='w-full' ref={inViewRef}>
					<div className='flex justify-center items-center  w-[260px] aspect-video bg-gray-200 rounded-lg'>
						<MdOutlinePermMedia size={'2.5rem'} color='white' />
					</div>
				</div>
			) : !media.showPreview ? (
				<div className='w-full relative'>
					<div className='flex justify-center items-center w-[16.25rem] aspect-video bg-gray-200 rounded-lg'>
						<MdOutlinePermMedia size={'2.5rem'} color='white' />
					</div>
					<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-600 opacity-80 w-fit-content px-4 h-10 rounded-full'>
						<div
							className='flex gap-2 cursor-pointer items-center justify-center h-full'
							onClick={handlePreview}
						>
							<ArrowDownToLine className='w-4 h-4 text-white' />
							<p className='text-white text-sm'>{getFileSize(media.size)}</p>
						</div>
					</div>
				</div>
			) : (
				<div className='flex flex-col w-[400px] max-w-full aspect-square relative mx-auto'>
					<div className=' mx-auto h-[94%] aspect-square'>
						<PreviewFile
							data={{
								url: `${SERVER_URL}uploads/download-meta-media/${message.body?.media_id}`,
								type: getFileType(media.mimeType),
							}}
						/>
					</div>
					<p className=' text-center cursor-pointer underline' onClick={handleDownload}>
						Download
					</p>
				</div>
			)}
		</ChatMessageWrapper>
	);
};

const ContactMessage = ({ message }: { message: TMessage }) => {
	const { value: isOpen, on: open, off: close } = useBoolean();
	return (
		<Each
			items={(message.body?.contacts ?? []) as Contact[]}
			render={(contact, index) => (
				<>
					<ChatMessageWrapper message={message}>
						<div>
							<div className='flex gap-2'>
								<Avatar className='w-6 h-6'>
									<AvatarFallback>
										{getInitials(contact.name?.formatted_name ?? ' ').charAt(0)}
									</AvatarFallback>
								</Avatar>
								<p className='flex-1'>{contact.name?.formatted_name}</p>
							</div>
							<Separator className='my-2 bg-gray-300' />

							<p
								className='text-sm cursor-pointer text-center text-primary hover:underline'
								onClick={open}
							>
								View Contact
							</p>
						</div>
					</ChatMessageWrapper>
					{isOpen && (
						<ContactDialog
							defaultValues={
								{
									id: '',
									...contact,
								} as Contact
							}
							canEdit={false}
							onClose={close}
						/>
					)}
				</>
			)}
		/>
	);
};

const UnknownMessage = ({ message }: { message: TMessage }) => {
	return (
		<ChatMessageWrapper message={message}>
			<div className='flex flex-col'>
				<ShieldX className='w-8 h-8 text-destructive' />
				<div>
					<p className='font-medium'>Unknown Message Type</p>
					<p className='whitespace-pre-wrap text-sm'>This message cannot be rendered here.</p>
				</div>
			</div>
		</ChatMessageWrapper>
	);
};
