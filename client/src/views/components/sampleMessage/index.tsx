/* eslint-disable @typescript-eslint/no-explicit-any */
import { LinkIcon, PhoneIcon } from '@chakra-ui/icons';
import { Avatar, Box, Center, Divider, Flex, Text } from '@chakra-ui/react';
import { FaVideo } from 'react-icons/fa';
import { IoDocumentText } from 'react-icons/io5';
import { MdOutlinePermMedia, MdReply } from 'react-icons/md';
import Each from '../utils/Each';

type Props = {
	components: Record<string, any>[];
};
export default function SampleMessage({ components }: Props) {
	const header = components.find((component) => component.type === 'HEADER');
	const body = components.find((component) => component.type === 'BODY');
	const footer = components.find((component) => component.type === 'FOOTER');
	const buttons = components.find((component) => component.type === 'BUTTONS')?.buttons ?? [];

	return (
		<Box
			shadow={'lg'}
			dropShadow={'lg'}
			minWidth={'200px'}
			minHeight={'fit-content'}
			width={'95%'}
			mx={'auto'}
			my={'1rem'}
			bgColor={'white'}
			rounded={'2xl'}
			padding={'8px'}
		>
			<Box height={'full'} bgColor={'white'} rounded={'2xl'} overflow={'hidden'}>
				<Box bgColor={'teal.900'} height={'20px'} borderTopRadius={'2xl'} />
				<Flex bgColor={'teal.700'} height={'50px'} alignItems={'center'} px={'0.5rem'} gap={3}>
					<Avatar name='Dan Abrahmov' src='https://bit.ly/dan-abramov' size={'sm'} />
					<Text color={'white'}>Dan Abrahmov</Text>
				</Flex>
				<Box padding={'1rem'} height={'500px'} bgColor={'#ece9e2'}>
					<Box bgColor={'white'} rounded={'2xl'} p={'0.5rem'}>
						<Box hidden={!header}>
							{header?.format === 'TEXT' && <Text fontWeight={'medium'}>{header.text}</Text>}
							{header?.format !== 'TEXT' && (
								<Center
									alignItems={'center'}
									bgColor={'lightgray'}
									width={'full'}
									aspectRatio={16 / 9}
									rounded={'xl'}
								>
									{header?.format === 'IMAGE' && (
										<MdOutlinePermMedia size={'2.5rem'} color='white' />
									)}
									{header?.format === 'VIDEO' && <FaVideo size={'2.5rem'} color='white' />}
									{header?.format === 'DOCUMENT' && (
										<IoDocumentText size={'2.5rem'} color='white' />
									)}
								</Center>
							)}
						</Box>
						<Box hidden={!body} mt={'0.5rem'}>
							{body && body.text ? <Text whiteSpace={'pre-line'}>{body.text}</Text> : null}
						</Box>
						<Box hidden={!footer} mt={'0.5rem'}>
							{footer && footer.text ? <Text fontSize={'0.75rem'}>{footer.text}</Text> : null}
						</Box>
						<Divider hidden={buttons.length === 0} my={'0.5rem'} borderColor={'gray.400'} />
						<Each
							items={buttons}
							render={(button: { text: string; type: string }) => (
								<Center
									alignItems={'center'}
									hidden={!button.text}
									borderColor={'teal.500'}
									borderWidth={'1px'}
									color={'teal.500'}
									rounded={'md'}
									p={'0.25rem'}
									textAlign={'center'}
									gap={2}
									my={'0.25rem'}
								>
									{button.type === 'QUICK_REPLY' && <MdReply color='teal.500' />}
									{button.type === 'PHONE_NUMBER' && <PhoneIcon color='teal.500' />}
									{button.type === 'URL' && <LinkIcon color='teal.500' />}
									<Text fontSize={'0.9rem'}>{button.text}</Text>
								</Center>
							)}
						/>

						<Flex justifyContent={'flex-end'} fontSize={'0.75rem'} marginTop={'0.25rem'}>
							<Text fontWeight={'medium'}>
								{new Date().toLocaleTimeString('en-US', {
									hour: '2-digit',
									minute: '2-digit',
								})}
							</Text>
						</Flex>
					</Box>
				</Box>
			</Box>
		</Box>
	);
}
