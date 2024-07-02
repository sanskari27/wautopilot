import { ArrowLeftIcon } from '@chakra-ui/icons';
import {
	Box,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerOverlay,
	IconButton,
	Text,
	VStack,
	useDisclosure,
} from '@chakra-ui/react';
import { useRef } from 'react';
import { FaGooglePlay, FaImage, FaListAlt, FaVideo } from 'react-icons/fa';
import { IoMdRadioButtonOn, IoMdText } from 'react-icons/io';
import { IoDocumentText } from 'react-icons/io5';
import { MdAudiotrack } from 'react-icons/md';
import { Panel } from 'reactflow';
import {
	ButtonNodeDetails,
	DocumentNodeDetails,
	ListNodeDetails,
	StartNodeDetails,
	TextNodeDetails,
} from './RenderFlow';
import {
	AudioMessage,
	AudioMessageHandle,
	ButtonMessage,
	ButtonMessageHandle,
	DocumentMessage,
	DocumentMessageHandle,
	ImageMessage,
	ImageMessageHandle,
	ListMessage,
	ListMessageHandle,
	TextMessage,
	TextMessageHandle,
	VideoMessage,
	VideoMessageHandle,
} from './createMessage';

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

export default function CreateFlowComponent({ addNode }: Props) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const textMessageRef = useRef<TextMessageHandle>(null);
	const imageMessageRef = useRef<ImageMessageHandle>(null);
	const audioMessageRef = useRef<AudioMessageHandle>(null);
	const videoMessageRef = useRef<VideoMessageHandle>(null);
	const documentMessageRef = useRef<DocumentMessageHandle>(null);
	const buttonMessageRef = useRef<ButtonMessageHandle>(null);
	const listMessageRef = useRef<ListMessageHandle>(null);

	const handleMessageTypeClick = (type: MessageTypes) => {
		if (type === 'START') {
			addNode({
				type: 'START',
			});
		} else if (type === 'TEXT') textMessageRef.current?.open();
		else if (type === 'IMAGE') imageMessageRef.current?.open();
		else if (type === 'AUDIO') audioMessageRef.current?.open();
		else if (type === 'VIDEO') videoMessageRef.current?.open();
		else if (type === 'DOCUMENT') documentMessageRef.current?.open();
		else if (type === 'BUTTON') buttonMessageRef.current?.open();
		else if (type === 'LIST') listMessageRef.current?.open();

		onClose();
	};

	const handleTextElement = (text: string) => {
		addNode({
			type: 'TEXT',
			data: text,
		});
	};
	const handleButtonElement = (text: string, buttons: string[]) => {
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
		sections: { title: string; buttons: string[] }[];
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
		buttons: string[]
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
		<>
			<Panel position='top-right'>
				<IconButton
					aria-label='Save Flow'
					icon={<ArrowLeftIcon />}
					colorScheme='green'
					onClick={onOpen}
				/>
			</Panel>
			<Drawer
				placement={'right'}
				onClose={onClose}
				isOpen={isOpen}
				size={'md'}
				closeOnEsc
				closeOnOverlayClick
			>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerBody paddingY={'2rem'}>
						<VStack width={'full'} gap={'1rem'}>
							<MessageType
								body={'Start Flow'}
								footer={'Use this to start the flow.'}
								icon={<FaGooglePlay size={'1.5rem'} />}
								onClick={() => handleMessageTypeClick('START')}
								bgColor={'green.500'}
							/>
							<MessageType
								body={'Text Message'}
								footer={'Use text message to show final output of the flow.'}
								icon={<IoMdText size={'1.5rem'} />}
								onClick={() => handleMessageTypeClick('TEXT')}
								bgColor={'red.500'}
							/>
							<MessageType
								body={'Image Message'}
								footer={'Use image message to share image in the chat.'}
								icon={<FaImage size={'1.5rem'} />}
								onClick={() => handleMessageTypeClick('IMAGE')}
								bgColor={'blue.500'}
							/>
							<MessageType
								body={'Audio Message'}
								footer={'Use audio message to share audio in the chat.'}
								icon={<MdAudiotrack size={'1.5rem'} />}
								onClick={() => handleMessageTypeClick('AUDIO')}
								bgColor={'green.500'}
							/>
							<MessageType
								body={'Video Message'}
								footer={'Use video message to share video in the chat.'}
								icon={<FaVideo size={'1.5rem'} />}
								onClick={() => handleMessageTypeClick('VIDEO')}
								bgColor={'purple.500'}
							/>
							<MessageType
								body={'Document Message'}
								footer={'Use document message to share document in the chat.'}
								icon={<IoDocumentText size={'1.5rem'} />}
								onClick={() => handleMessageTypeClick('DOCUMENT')}
								bgColor={'cyan.500'}
							/>
							<MessageType
								body={'Button Message'}
								footer={'Use button message to control the flow of bot.'}
								icon={<IoMdRadioButtonOn size={'1.5rem'} />}
								onClick={() => handleMessageTypeClick('BUTTON')}
								bgColor={'orange.500'}
							/>
							<MessageType
								body={'List Message'}
								footer={'Use list message to show list of items in the chat.'}
								icon={<FaListAlt size={'1.5rem'} />}
								onClick={() => handleMessageTypeClick('LIST')}
								bgColor={'gray.500'}
							/>
						</VStack>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
			<TextMessage ref={textMessageRef} onTextMessageAdded={handleTextElement} />
			<ImageMessage
				ref={imageMessageRef}
				onImageMessageAdded={(id, cap, buttons) => handleDocumentElement('IMAGE', id, cap, buttons)}
			/>
			<AudioMessage
				ref={audioMessageRef}
				onAudioMessageAdded={(id, cap, buttons) => handleDocumentElement('AUDIO', id, cap, buttons)}
			/>
			<VideoMessage
				ref={videoMessageRef}
				onVideoMessageAdded={(id, cap, buttons) => handleDocumentElement('VIDEO', id, cap, buttons)}
			/>
			<DocumentMessage
				ref={documentMessageRef}
				onDocumentMessageAdded={(id, cap, buttons) =>
					handleDocumentElement('DOCUMENT', id, cap, buttons)
				}
			/>
			<ButtonMessage ref={buttonMessageRef} onButtonMessageAdded={handleButtonElement} />
			<ListMessage ref={listMessageRef} onListMessageAdded={handleListElement} />
		</>
	);
}

type MessageTypeProps = {
	body: string;
	footer: string;
	bgColor: string;
	icon: React.ReactNode;
	onClick: () => void;
};

function MessageType({ body, footer, icon, onClick, bgColor }: MessageTypeProps) {
	return (
		<Box
			bgColor={bgColor}
			rounded={'2xl'}
			p={'1rem'}
			onClick={onClick}
			width={'full'}
			cursor={'pointer'}
		>
			<Text
				fontWeight={'medium'}
				fontSize={'1.15rem'}
				display={'inline-flex'}
				alignItems={'center'}
				gap={'0.5rem'}
				color={'white'}
			>
				{icon}
				{body}
			</Text>
			<Text fontSize={'0.90rem'} color={'gray.50'}>
				{footer}
			</Text>
		</Box>
	);
}
