import { ChevronDownIcon, PhoneIcon } from '@chakra-ui/icons';
import { Button, Divider, Flex, Icon, Text, VStack } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { BiCheckDouble, BiLink } from 'react-icons/bi';
import { CgTimer } from 'react-icons/cg';
import { FaReply } from 'react-icons/fa';
import { IoCall } from 'react-icons/io5';
import { Message } from '../../../../store/types/MessageState';
import Each from '../../../components/utils/Each';

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
				paddingLeft={'1rem'}
				paddingRight={'1.6rem'}
				paddingY={'0.5rem'}
				borderTopRadius={'2xl'}
				marginBottom={'0.25rem'}
				borderBottomStartRadius={isMe ? 'none' : '2xl'}
				borderBottomEndRadius={isMe ? '2xl' : 'none'}
				position={'relative'}
				className='group'
			>
				<Icon
					as={ChevronDownIcon}
					position={'absolute'}
					right={'10px'}
					fontSize={'1rem'}
					cursor={'pointer'}
					className='group-hover:!block !hidden'
				/>
				{children}
				{message.buttons.length > 0 && (
					<>
						<Divider orientation='horizontal' my={'1rem'} />
						<VStack width={'full'}>
							<Each
								items={message.buttons}
								render={(button, index) => (
									<Button
										width={'full'}
										key={index}
										variant={'outline'}
										colorScheme='green'
										cursor={'pointer'}
										textAlign={'center'}
										leftIcon={
											<Icon
												as={
													button.button_type === 'URL'
														? BiLink
														: button.button_type === 'QUICK_REPLY'
														? FaReply
														: button.button_type === 'PHONE_NUMBER'
														? PhoneIcon
														: IoCall
												}
											/>
										}
									>
										{button.button_content}
									</Button>
								)}
							/>
						</VStack>
					</>
				)}
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
