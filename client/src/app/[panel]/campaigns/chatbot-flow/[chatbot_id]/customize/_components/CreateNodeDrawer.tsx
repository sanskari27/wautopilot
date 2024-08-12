'use client';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import useBoolean from '@/hooks/useBoolean';
import { cn } from '@/lib/utils';
import { Panel } from '@xyflow/react';
import { ChevronsLeft } from 'lucide-react';
import { FaGooglePlay, FaImage, FaListAlt, FaVideo } from 'react-icons/fa';
import { IoMdRadioButtonOn, IoMdText } from 'react-icons/io';
import { IoDocumentText } from 'react-icons/io5';
import { MdAudiotrack } from 'react-icons/md';
import {
	AudioMessage,
	ButtonMessage,
	DocumentMessage,
	ImageMessage,
	ListMessage,
	TextMessage,
	VideoMessage,
} from '../message';
import {
	ButtonNodeDetails,
	DocumentNodeDetails,
	ListNodeDetails,
	StartNodeDetails,
	TextNodeDetails,
} from './RenderFlow';

type MessageTypes = 'TEXT' | 'IMAGE' | 'AUDIO' | 'VIDEO' | 'DOCUMENT' | 'BUTTON' | 'LIST' | 'START';

type Props = {
	addNode: (
		details:
			| StartNodeDetails
			| TextNodeDetails
			| DocumentNodeDetails
			| ButtonNodeDetails
			| ListNodeDetails
	) => void;
};

type Button = {
	id: string;
	text: string;
};

export default function CreateNodeDrawer({ addNode }: Props) {
	const { value: isOpen, on: onOpen, off: onClose, set: setSheetOpen } = useBoolean();

	const handleMessageTypeClick = (type: MessageTypes) => {
		if (type === 'START') {
			addNode({
				type: 'START',
			});
		}

		// onClose();
	};

	const handleTextElement = (text: string) => {
		addNode({
			type: 'TEXT',
			data: text,
		});
	};
	const handleButtonElement = (text: string, buttons: Button[]) => {
		addNode({
			type: 'BUTTON',
			data: {
				text,
				buttons,
			},
		});
	};
	const handleListElement = (details: {
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
		buttons: Button[]
	) => {
		addNode({
			type: type,
			data: {
				id,
				caption,
				buttons,
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
			<SheetContent>
				<div className='py-8 overflow-y-auto'>
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
							onImageMessageAdded={(id, cap, buttons) =>
								handleDocumentElement('IMAGE', id, cap, buttons)
							}
						>
							<MessageType
								body={'Image Message'}
								icon={<FaImage size={'1.25rem'} />}
								className={'bg-blue-500'}
							/>
						</ImageMessage>
						<AudioMessage
							onAudioMessageAdded={(id, cap, buttons) =>
								handleDocumentElement('AUDIO', id, cap, buttons)
							}
						>
							<MessageType
								body={'Audio Message'}
								icon={<MdAudiotrack size={'1.25rem'} />}
								className={'bg-green-500'}
							/>
						</AudioMessage>
						<VideoMessage
							onVideoMessageAdded={(id, cap, buttons) =>
								handleDocumentElement('VIDEO', id, cap, buttons)
							}
						>
							<MessageType
								body={'Video Message'}
								icon={<FaVideo size={'1.25rem'} />}
								className={'bg-purple-500'}
							/>
						</VideoMessage>

						<DocumentMessage
							onDocumentMessageAdded={(id, cap, buttons) =>
								handleDocumentElement('DOCUMENT', id, cap, buttons)
							}
						>
							<MessageType
								body={'Document Message'}
								icon={<IoDocumentText size={'1.25rem'} />}
								className={'bg-cyan-500'}
							/>
						</DocumentMessage>

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
