import { Flex, Icon, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { BiCheckDouble } from 'react-icons/bi';
import { CgTimer } from 'react-icons/cg';
import { Message } from '../../../../store/types/MessageState';

const ChatMessageWrapper = ({ message, children }: { message: Message; children: ReactNode }) => {
	const isMe = !!message.received_at;
	return (
		<Flex
			direction={'column'}
			key={message._id}
			maxW={'65%'}
			marginBottom={'1rem'}
			alignSelf={isMe ? 'flex-start' : 'flex-end'}
		>
			<Flex
				direction={'column'}
				bgColor={isMe ? 'white' : '#dcf8c6'}
				paddingX={'1rem'}
				paddingY={'0.5rem'}
				borderTopRadius={'2xl'}
				marginBottom={'0.25rem'}
				borderBottomStartRadius={isMe ? 'none' : '2xl'}
				borderBottomEndRadius={isMe ? '2xl' : 'none'}
				position={'relative'}
			>
				{children}
			</Flex>
			<Flex gap={1} alignItems={'center'} justifyContent={isMe ? 'flex-start' : 'flex-end'}>
				{message.delivered_at && <FormatTime time={message.delivered_at} />}
				{message.received_at && <FormatTime time={message.received_at} />}
				{message.delivered_at ? (
					<Icon fontSize={'1.25rem'} alignSelf={'flex-end'} as={BiCheckDouble} color='gray.500' />
				) : message.read_at ? (
					<Icon fontSize={'1.25rem'} alignSelf={'flex-end'} as={BiCheckDouble} color='blue.500' />
				) : isMe ? (
					<Icon fontSize={'1.25rem'} alignSelf={'flex-end'} as={CgTimer} color='gray.500' />
				) : null}
			</Flex>
		</Flex>
	);
};

const FormatTime = ({ time }: { time: string }) => {
	const formattedTime =
		new Date(time).getDate() +
		'/' +
		(new Date(time).getMonth() + 1) +
		'/' +
		new Date(time).getFullYear() +
		' ' +
		new Date(time).toLocaleTimeString();
	return (
		<Text textAlign={'right'} fontSize={'xs'}>
			{formattedTime}
		</Text>
	);
};

export default ChatMessageWrapper;
