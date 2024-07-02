import { Flex, Text } from '@chakra-ui/react';

export default function ChatbotFlow() {
	return (
		<Flex
			direction={'column'}
			gap={'1rem'}
			className='custom-scrollbar'
			justifyContent={'center'}
			p={'1rem'}
		>
			<Text fontSize={'2xl'} fontWeight={'bold'}>
				Chatbot Flow
			</Text>
		</Flex>
	);
}
