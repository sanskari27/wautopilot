'use client';
import { QuickTemplateMessageProps } from '@/app/panel/conversations/_components/message-input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import useBoolean from '@/hooks/useBoolean';
import { cn } from '@/lib/utils';
import { Contact } from '@/schema/phonebook';
import { Panel } from '@xyflow/react';
import { ChevronsLeft } from 'lucide-react';
import { FaGooglePlay, FaImage, FaListAlt, FaVideo } from 'react-icons/fa';
import { FaPause } from 'react-icons/fa6';
import { IoMdRadioButtonOn, IoMdText } from 'react-icons/io';
import { IoDocumentText, IoLocationSharp } from 'react-icons/io5';
import { MdAudiotrack, MdContactPage } from 'react-icons/md';
import { PiFlowArrowBold } from 'react-icons/pi';
import {
	AudioMessage,
	ButtonMessage,
	DocumentMessage,
	ImageMessage,
	ListMessage,
	LocationRequestMessage,
	TextMessage,
	VideoMessage,
	WhatsappFlowMessage,
} from '../message';
import ContactMessage from '../message/ContactMessage';
import TemplateMessage from '../message/TemplateMessage';
import {
	ButtonNodeDetails,
	ContactNodeDetails,
	DocumentNodeDetails,
	EndNodeDetails,
	FlowNodeDetails,
	ListNodeDetails,
	LocationRequestNodeDetails,
	StartNodeDetails,
	TemplateMessageNodeDetails,
	TextNodeDetails,
} from './RenderFlow';

type Props = {
	addNode: (
		details:
			| StartNodeDetails
			| TextNodeDetails
			| DocumentNodeDetails
			| ButtonNodeDetails
			| ListNodeDetails
			| FlowNodeDetails
			| ContactNodeDetails
			| LocationRequestNodeDetails
			| EndNodeDetails
			| TemplateMessageNodeDetails
	) => void;
};

type Button = {
	id: string;
	text: string;
};

export default function CreateNodeDrawer({ addNode }: Props) {
	const { value: isOpen, on: onOpen, set: setSheetOpen } = useBoolean();

	const handleTextElement = (text: string, delay: number, reply_to_message: boolean) => {
		addNode({
			type: 'TEXT',
			data: {
				reply_to_message,
				label: text,
				delay,
			},
		});
	};
	const handleButtonElement = (
		text: string,
		buttons: Button[],
		delay: number,
		reply_to_message: boolean
	) => {
		addNode({
			type: 'BUTTON',
			data: {
				reply_to_message,
				text,
				buttons,
				delay,
			},
		});
	};
	const handleListElement = (details: {
		reply_to_message: boolean;
		header: string;
		body: string;
		footer: string;
		sections: {
			title: string;
			buttons: {
				id: string;
				text: string;
			}[];
		}[];
		delay: number;
	}) => {
		addNode({
			type: 'LIST',
			data: details,
		});
	};

	const handleDocumentElement = (
		type: 'IMAGE' | 'AUDIO' | 'VIDEO' | 'DOCUMENT',
		id: string,
		caption: string,
		delay: number,
		reply_to_message: boolean
	) => {
		addNode({
			type: type,
			data: {
				reply_to_message,
				id,
				caption,
				delay,
			},
		});
	};

	const handleWhatsappFlowMessage = (details: {
		header: string;
		body: string;
		footer: string;
		flow_id: string;
		button: {
			id: string;
			text: string;
		};
		delay: number;
		reply_to_message: boolean;
	}) => {
		addNode({
			type: 'WHATSAPP_FLOW',
			data: details,
		});
	};

	const handleLocationRequestMessage = (details: {
		text: string;
		delay: number;
		button_id: string;
		reply_to_message: boolean;
	}) => {
		addNode({
			type: 'LOCATION_REQUEST',
			data: {
				label: details.text,
				delay: details.delay,
				button: {
					id: details.button_id,
				},
				reply_to_message: details.reply_to_message,
			},
		});
	};

	const handleContactElement = (contact: Contact, delay: number, reply_to_message: boolean) => {
		addNode({
			type: 'CONTACT',
			data: {
				reply_to_message,
				contact,
				delay,
			},
		});
	};

	const handleTemplateMessage = (
		details: QuickTemplateMessageProps,
		delay: number,
		reply_to_message: boolean
	) => {
		addNode({
			type: 'TEMPLATE_MESSAGE',
			data: {
				reply_to_message,
				...details,
				delay,
			},
		});
	};

	return (
		<Sheet open={isOpen} onOpenChange={setSheetOpen}>
			<SheetTrigger asChild>
				<Panel position='top-right'>
					<Button size={'icon'} onClick={onOpen}>
						<ChevronsLeft className='w-4 h-4' />
					</Button>
				</Panel>
			</SheetTrigger>
			<SheetContent className='p-0'>
				<div className='py-10 px-8 h-full w-full overflow-y-auto'>
					<div className='flex flex-col w-full gap-4'>
						<MessageType
							body={'Start Flow'}
							icon={<FaGooglePlay size={'1.25rem'} />}
							className={'bg-green-500'}
							onClick={() =>
								addNode({
									type: 'START',
								})
							}
						/>
						<TextMessage onTextMessageAdded={handleTextElement}>
							<MessageType
								body={'Text Message'}
								icon={<IoMdText size={'1.25rem'} />}
								className={'bg-red-500'}
							/>
						</TextMessage>
						<ImageMessage
							onImageMessageAdded={(id, cap, delay, reply_to_message) =>
								handleDocumentElement('IMAGE', id, cap, delay, reply_to_message)
							}
						>
							<MessageType
								body={'Image Message'}
								icon={<FaImage size={'1.25rem'} />}
								className={'bg-blue-500'}
							/>
						</ImageMessage>
						<AudioMessage
							onAudioMessageAdded={(id, cap, delay, reply_to_message) =>
								handleDocumentElement('AUDIO', id, cap, delay, reply_to_message)
							}
						>
							<MessageType
								body={'Audio Message'}
								icon={<MdAudiotrack size={'1.25rem'} />}
								className={'bg-green-500'}
							/>
						</AudioMessage>
						<VideoMessage
							onVideoMessageAdded={(id, cap, delay, reply_to_message) =>
								handleDocumentElement('VIDEO', id, cap, delay, reply_to_message)
							}
						>
							<MessageType
								body={'Video Message'}
								icon={<FaVideo size={'1.25rem'} />}
								className={'bg-purple-500'}
							/>
						</VideoMessage>

						<DocumentMessage
							onDocumentMessageAdded={(id, cap, delay, reply_to_message) =>
								handleDocumentElement('DOCUMENT', id, cap, delay, reply_to_message)
							}
						>
							<MessageType
								body={'Document Message'}
								icon={<IoDocumentText size={'1.25rem'} />}
								className={'bg-cyan-500'}
							/>
						</DocumentMessage>

						<ContactMessage onContactAdded={handleContactElement}>
							<MessageType
								body={'Contact Message'}
								icon={<MdContactPage size={'1.25rem'} />}
								className={'bg-lime-500'}
							/>
						</ContactMessage>

						<ButtonMessage onButtonMessageAdded={handleButtonElement}>
							<MessageType
								body={'Button Message'}
								icon={<IoMdRadioButtonOn size={'1.25rem'} />}
								className={'bg-orange-500'}
							/>
						</ButtonMessage>

						<ListMessage onListMessageAdded={handleListElement}>
							<MessageType
								body={'List Message'}
								icon={<FaListAlt size={'1.25rem'} />}
								className={'bg-gray-500'}
							/>
						</ListMessage>
						<LocationRequestMessage onLocationRequestMessageAdded={handleLocationRequestMessage}>
							<MessageType
								body={'Location Request Message'}
								icon={<IoLocationSharp size={'1.25rem'} />}
								className={'bg-orange-500'}
							/>
						</LocationRequestMessage>
						<TemplateMessage onTemplateMessageAdded={handleTemplateMessage}>
							<MessageType
								body={'Template Message'}
								icon={<IoMdText size={'1.25rem'} />}
								className={'bg-red-500'}
							/>
						</TemplateMessage>
						<WhatsappFlowMessage onWhatsappFlowMessageAdded={handleWhatsappFlowMessage}>
							<MessageType
								body={'Whatsapp Flow Message'}
								icon={<PiFlowArrowBold size={'1.25rem'} />}
								className={'bg-indigo-500'}
							/>
						</WhatsappFlowMessage>
						<MessageType
							body={'End Flow'}
							icon={<FaPause size={'1.25rem'} />}
							className={'bg-green-500'}
							onClick={() =>
								addNode({
									type: 'END',
								})
							}
						/>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}

type MessageTypeProps = {
	body: string;
	className: string;
	icon: React.ReactNode;
	onClick?: () => void;
};

function MessageType({ body, icon, className, onClick = () => {} }: MessageTypeProps) {
	return (
		<div
			className={cn(
				'rounded-2xl px-4 py-2 gap-2 w-full cursor-pointer flex items-center text-white',
				className
			)}
			onClick={onClick}
		>
			{icon}
			<p className='font-medium text-lg m-0 p-0'>{body}</p>
		</div>
	);
}
