'use client';
import Each from '@/components/containers/each';
import { useQuickReplies } from '@/components/context/quick-replies';
import { useRecipient } from '@/components/context/recipients';
import ContactSelectorDialog from '@/components/elements/dialogs/contact-selector';
import MediaSelectorDialog from '@/components/elements/dialogs/media-selector';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import useBoolean from '@/hooks/useBoolean';
import { Contact } from '@/schema/phonebook';
import MessagesService from '@/services/messages.service';
import {
	Clapperboard,
	Contact as ContactIcon,
	FileText,
	HardDriveUpload,
	Image as ImageIcon,
	Loader2,
	MessageSquareQuote,
	Music,
	Paperclip,
	Pencil,
	Plus,
	SendHorizontal,
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import QuickReplyDialog from './add-quick-reply-dialog';
import { UploadMediaDialog } from './dialogs';

export default function MessageBox() {
	const { value: isMessageSending, on: setSending, off: setNotSending } = useBoolean(false);
	const { value: quickReply, toggle: toggleQuickReply } = useBoolean(true);
	const { selected_recipient } = useRecipient();
	const [textMessage, setTextMessage] = useState('');
	const { list } = useQuickReplies();
	const [selectedQuickReply, setSelectedQuickReply] = useState('');

	const handleTextMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setTextMessage(e.target.value);
		setSelectedQuickReply('');
	};

	const sendTextMessage = () => {
		if (!textMessage.trim()) return;
		setSending();
		MessagesService.sendConversationMessage(selected_recipient!.id, {
			type: 'text',
			text: textMessage,
		}).then((data) => {
			setNotSending();
			setSelectedQuickReply('');

			if (!data) {
				return toast.error('Failed to send message');
			}
			setTextMessage('');
		});
	};

	const sendAttachmentMessage = (
		type: 'PHOTOS' | 'VIDEO' | 'AUDIO' | 'DOCUMENT',
		attachments: string[]
	) => {
		if (attachments.length === 0) return;

		const _type = type === 'PHOTOS' ? 'image' : type.toLowerCase();

		for (let i = 0; i < attachments.length; i++) {
			MessagesService.sendConversationMessage(selected_recipient!.id, {
				type: _type as 'image' | 'video' | 'document' | 'audio',
				media_id: attachments[i],
			});
		}
	};

	const sendContactMessage = (contact: Contact[]) => {
		MessagesService.sendConversationMessage(selected_recipient!.id, {
			type: 'contacts',
			contacts: contact,
		}).then((data) => {
			if (!data) {
				toast.error('Failed to send message');
			}
		});
	};

	const handleMessageInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		e.target.style.height = '5px';
		e.target.style.height = e.target.scrollHeight + 'px';
	};
	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendTextMessage();
		}
	};

	function formatMessage(text: string) {
		const firstLine = text.split('\n')?.[0].trim() ?? '';
		return firstLine.length > 70 ? firstLine.slice(0, 70) + '...' : firstLine;
	}

	return (
		<>
			<div
				className={`${
					quickReply ? 'h-0 p-0' : 'p-2'
				} overflow-hidden flex w-full bg-white border-b border-b-gray-200 gap-x-2`}
			>
				<Select
					value={selectedQuickReply}
					onValueChange={(val) => {
						setTextMessage(list.find((item) => item.id === val)?.message ?? '');
						setSelectedQuickReply(val);
					}}
				>
					<SelectTrigger className='w-full !ring-0'>
						<SelectValue placeholder='Select a quick reply' />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<Each
								items={list}
								render={(item) => (
									<SelectItem value={item.id}>{formatMessage(item.message)}</SelectItem>
								)}
							/>
						</SelectGroup>
					</SelectContent>
				</Select>

				{!selectedQuickReply ? (
					<QuickReplyDialog>
						<Button variant={'secondary'} size={'icon'}>
							<Plus className='w-4 h-4' />
						</Button>
					</QuickReplyDialog>
				) : (
					<QuickReplyDialog
						id={selectedQuickReply}
						message={list.find((item) => item.id === selectedQuickReply)?.message ?? ''}
					>
						<Button variant={'secondary'} size={'icon'}>
							<Pencil className='w-4 h-4' />
						</Button>
					</QuickReplyDialog>
				)}
			</div>
			<div className='flex bg-white w-full p-2 items-end gap-1'>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' size={'icon'}>
							<Paperclip className='w-4 h-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className='w-56'>
						<MediaSelectorDialog
							onConfirm={(media) => sendAttachmentMessage('DOCUMENT', media)}
							returnType='media_id'
							type='document'
						>
							<Button variant={'ghost'} size={'sm'} className='w-full justify-start'>
								<FileText className='w-4 h-4 mr-2' />
								Documents
							</Button>
						</MediaSelectorDialog>

						<MediaSelectorDialog
							onConfirm={(media) => sendAttachmentMessage('PHOTOS', media)}
							returnType='media_id'
							type='image'
						>
							<Button variant={'ghost'} size={'sm'} className='w-full justify-start'>
								<ImageIcon className='w-4 h-4 mr-2' />
								Photos
							</Button>
						</MediaSelectorDialog>

						<MediaSelectorDialog
							onConfirm={(media) => sendAttachmentMessage('VIDEO', media)}
							returnType='media_id'
							type='video'
						>
							<Button variant={'ghost'} size={'sm'} className='w-full justify-start'>
								<Clapperboard className='w-4 h-4 mr-2' />
								Video
							</Button>
						</MediaSelectorDialog>

						<MediaSelectorDialog
							onConfirm={(media) => sendAttachmentMessage('AUDIO', media)}
							returnType='media_id'
							type='audio'
						>
							<Button variant={'ghost'} size={'sm'} className='w-full justify-start'>
								<Music className='w-4 h-4 mr-2' />
								Audio
							</Button>
						</MediaSelectorDialog>

						<ContactSelectorDialog onConfirm={sendContactMessage} newEntryAllowed>
							<Button variant={'ghost'} size={'sm'} className='w-full justify-start'>
								<ContactIcon className='w-4 h-4 mr-2' />
								Contact
							</Button>
						</ContactSelectorDialog>
						<UploadMediaDialog onConfirm={(media) => sendAttachmentMessage('DOCUMENT', [media])}>
							<Button variant={'ghost'} size={'sm'} className='w-full justify-start'>
								<HardDriveUpload className='w-4 h-4 mr-2' />
								Upload File
							</Button>
						</UploadMediaDialog>
					</DropdownMenuContent>
				</DropdownMenu>
				<Button variant={'ghost'} size={'icon'} onClick={toggleQuickReply}>
					<MessageSquareQuote className='w-4 h-4' />
				</Button>
				<Textarea
					className='max-h-[150px] min-h-[40px] h-[40px] resize-none !ring-0'
					onKeyDown={handleKeyDown}
					onInput={handleMessageInput}
					value={textMessage}
					onChange={handleTextMessageChange}
					placeholder='Type a message'
				/>
				<Button className='px-4' onClick={sendTextMessage} disabled={isMessageSending}>
					{isMessageSending ? (
						<Loader2 className='w-4 h-4 animate-spin mr-2' />
					) : (
						<SendHorizontal className='w-4 h-4' />
					)}
				</Button>
			</div>
		</>
	);
}
