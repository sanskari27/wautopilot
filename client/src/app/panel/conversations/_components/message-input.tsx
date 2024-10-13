'use client';
import Each from '@/components/containers/each';
import { useMessages } from '@/components/context/message-store-provider';
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
	List,
	Loader2,
	LocateIcon,
	MessageSquareQuote,
	Music,
	Paperclip,
	Pencil,
	Plus,
	SendHorizontal,
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { IoClose } from 'react-icons/io5';
import { MdSmartButton } from 'react-icons/md';
import { TbTemplate } from 'react-icons/tb';
import QuickReplyDialog from './add-quick-reply-dialog';
import {
	QuickButtonTemplateMessage,
	QuickFlowTemplateMessage,
	QuickListTemplateMessage,
	QuickLocationTemplateMessage,
	QuickTemplateMessage,
	UploadMediaDialog,
} from './dialogs';

export default function MessageBox({ isExpired }: { isExpired: boolean }) {
	const { value: isMessageSending, on: setSending, off: setNotSending } = useBoolean(false);
	const { value: quickReply, toggle: toggleQuickReply } = useBoolean(true);
	const { selected_recipient } = useRecipient();
	const [textMessage, setTextMessage] = useState('');
	const { textTemplates } = useQuickReplies();
	const [selectedQuickReply, setSelectedQuickReply] = useState('');

	const { replyMessageId, setReplyMessageId } = useMessages();

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
			...(replyMessageId && { context: { message_id: replyMessageId } }),
		}).then((data) => {
			setNotSending();
			setSelectedQuickReply('');
			setReplyMessageId('');
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
				context: { message_id: replyMessageId },
			}).then((data) => {
				if (!data) {
					return toast.error('Failed to send message');
				}
			});
		}
	};

	const sendContactMessage = (contact: Contact[]) => {
		MessagesService.sendConversationMessage(selected_recipient!.id, {
			type: 'contacts',
			contacts: contact,
			context: { message_id: replyMessageId },
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
		const firstLine = text?.split('\n')?.[0].trim() ?? '';
		return firstLine.length > 70 ? firstLine.slice(0, 70) + '...' : firstLine;
	}

	function sendQuickReplyMessage(id: string) {
		MessagesService.sendQuickTemplateMessage({
			recipientId: selected_recipient!.id,
			quickReply: id,
			context: { message_id: replyMessageId },
		}).then((data) => {
			setReplyMessageId('');
			if (!data) {
				toast.error('Failed to send message');
			}
		});
	}

	function sendQuickTemplateMessage(
		template_id: string,
		template_name: string,
		template_body: {
			variable_from: 'custom_text' | 'phonebook_data';
			custom_text: string;
			phonebook_data: string;
			fallback_value: string;
		}[],
		template_header: {
			type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'NONE';
			media_id: string;
			link?: string;
		}
	) {
		MessagesService.sendQuickTemplateMessage({
			recipientId: selected_recipient!.id,
			template_id,
			template_name,
			body: template_body,
			header: template_header,
			type: 'template',
			context: { message_id: replyMessageId },
		}).then((data) => {
			setReplyMessageId('');
			if (!data) {
				toast.error('Failed to send message');
			}
		});
	}

	const scrollToContext = () => {
		if (!replyMessageId) return;
		const context = document.getElementById(replyMessageId);
		if (!context) {
			toast.error('Message might have been deleted or not found in the conversation');
			return;
		}
		context.parentElement?.style.setProperty('background-color', '#80808030');
		setTimeout(() => {
			context.parentElement?.style.removeProperty('background-color');
		}, 2000);
		context?.scrollIntoView({ behavior: 'smooth' });
	};

	return (
		<>
			<div
				className={`${
					!replyMessageId ? 'h-0 p-0' : 'p-2 h-[60px]'
				} overflow-hidden flex w-full bg-white border-b border-b-gray-200 gap-x-2 transition-[1s]`}
			>
				{replyMessageId ? (
					<div
						className={
							'cursor-pointer flex pl-2 py-1 border-l-2 border-primary w-full items-center justify-between'
						}
					>
						<p onClick={scrollToContext} className='text-sm text-gray-500'>
							Show context
						</p>
						<Button
							onClick={() => setReplyMessageId('')}
							size={'sm'}
							className='rounded-full p-1'
							variant={'destructive'}
						>
							<IoClose className='w-6 h-6' />
						</Button>
					</div>
				) : null}
			</div>
			<div
				className={`${
					quickReply ? 'h-0 p-0' : 'p-2 h-[60px]'
				} overflow-hidden flex w-full bg-white border-b border-b-gray-200 gap-x-2 transition-[1s]`}
			>
				<Select
					disabled={isExpired}
					value={selectedQuickReply}
					onValueChange={(val) => {
						setTextMessage(textTemplates.find((item) => item.id === val)?.data.message ?? '');
						setSelectedQuickReply(val);
					}}
				>
					<SelectTrigger className='w-full !ring-0'>
						<SelectValue placeholder='Select a quick reply' />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<Each
								items={textTemplates}
								render={(item) => (
									<SelectItem value={item.id}>{formatMessage(item.data.message)}</SelectItem>
								)}
							/>
						</SelectGroup>
					</SelectContent>
				</Select>

				{!selectedQuickReply ? (
					<QuickReplyDialog>
						<Button disabled={isExpired} variant={'secondary'} size={'icon'}>
							<Plus className='w-4 h-4' />
						</Button>
					</QuickReplyDialog>
				) : (
					<QuickReplyDialog
						id={selectedQuickReply}
						message={
							textTemplates.find((item) => item.id === selectedQuickReply)?.data.message ?? ''
						}
					>
						<Button disabled={isExpired} variant={'secondary'} size={'icon'}>
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
							<Button
								disabled={isExpired}
								variant={'ghost'}
								size={'sm'}
								className='w-full justify-start'
							>
								<FileText className='w-4 h-4 mr-2' />
								Documents
							</Button>
						</MediaSelectorDialog>

						<MediaSelectorDialog
							onConfirm={(media) => sendAttachmentMessage('PHOTOS', media)}
							returnType='media_id'
							type='image'
						>
							<Button
								disabled={isExpired}
								variant={'ghost'}
								size={'sm'}
								className='w-full justify-start'
							>
								<ImageIcon className='w-4 h-4 mr-2' />
								Photos
							</Button>
						</MediaSelectorDialog>

						<MediaSelectorDialog
							onConfirm={(media) => sendAttachmentMessage('VIDEO', media)}
							returnType='media_id'
							type='video'
						>
							<Button
								disabled={isExpired}
								variant={'ghost'}
								size={'sm'}
								className='w-full justify-start'
							>
								<Clapperboard className='w-4 h-4 mr-2' />
								Video
							</Button>
						</MediaSelectorDialog>

						<MediaSelectorDialog
							onConfirm={(media) => sendAttachmentMessage('AUDIO', media)}
							returnType='media_id'
							type='audio'
						>
							<Button
								disabled={isExpired}
								variant={'ghost'}
								size={'sm'}
								className='w-full justify-start'
							>
								<Music className='w-4 h-4 mr-2' />
								Audio
							</Button>
						</MediaSelectorDialog>

						<ContactSelectorDialog onConfirm={sendContactMessage} newEntryAllowed>
							<Button
								disabled={isExpired}
								variant={'ghost'}
								size={'sm'}
								className='w-full justify-start'
							>
								<ContactIcon className='w-4 h-4 mr-2' />
								VCards
							</Button>
						</ContactSelectorDialog>
						<UploadMediaDialog onConfirm={(media) => sendAttachmentMessage('DOCUMENT', [media])}>
							<Button
								disabled={isExpired}
								variant={'ghost'}
								size={'sm'}
								className='w-full justify-start'
							>
								<HardDriveUpload className='w-4 h-4 mr-2' />
								Upload File
							</Button>
						</UploadMediaDialog>
						<QuickButtonTemplateMessage onConfirm={(id) => sendQuickReplyMessage(id)}>
							<Button
								disabled={isExpired}
								variant={'ghost'}
								size={'sm'}
								className='w-full justify-start'
							>
								<MdSmartButton className='w-4 h-4 mr-2' />
								Button message
							</Button>
						</QuickButtonTemplateMessage>
						<QuickListTemplateMessage onConfirm={(id) => sendQuickReplyMessage(id)}>
							<Button
								disabled={isExpired}
								variant={'ghost'}
								size={'sm'}
								className='w-full justify-start'
							>
								<List className='w-4 h-4 mr-2' />
								List message
							</Button>
						</QuickListTemplateMessage>
						<QuickFlowTemplateMessage onConfirm={(id) => sendQuickReplyMessage(id)}>
							<Button
								disabled={isExpired}
								variant={'ghost'}
								size={'sm'}
								className='w-full justify-start'
							>
								<HardDriveUpload className='w-4 h-4 mr-2' />
								Flow message
							</Button>
						</QuickFlowTemplateMessage>
						<QuickLocationTemplateMessage onConfirm={(id) => sendQuickReplyMessage(id)}>
							<Button
								disabled={isExpired}
								variant={'ghost'}
								size={'sm'}
								className='w-full justify-start'
							>
								<LocateIcon className='w-4 h-4 mr-2' />
								Location message
							</Button>
						</QuickLocationTemplateMessage>
						<QuickTemplateMessage
							onConfirm={(template_id, template_name, template_header, template_body) =>
								sendQuickTemplateMessage(template_id, template_name, template_body, template_header)
							}
						>
							<Button variant={'ghost'} size={'sm'} className='w-full justify-start'>
								<TbTemplate className='w-4 h-4 mr-2' />
								Template message
							</Button>
						</QuickTemplateMessage>
					</DropdownMenuContent>
				</DropdownMenu>
				<Button disabled={isExpired} variant={'ghost'} size={'icon'} onClick={toggleQuickReply}>
					<MessageSquareQuote className='w-4 h-4' />
				</Button>
				<Textarea
					disabled={isExpired}
					className='max-h-[150px] min-h-[40px] h-[40px] resize-none !ring-0'
					onKeyDown={handleKeyDown}
					onInput={handleMessageInput}
					value={textMessage}
					onChange={handleTextMessageChange}
					placeholder='Type a message'
				/>
				<Button className='px-4' onClick={sendTextMessage} disabled={isExpired || isMessageSending}>
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
