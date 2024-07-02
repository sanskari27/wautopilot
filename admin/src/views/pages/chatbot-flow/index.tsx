import { AddIcon } from '@chakra-ui/icons';
import { Button, Flex, HStack, Text } from '@chakra-ui/react';
import { Link, useOutlet } from 'react-router-dom';
import { NAVIGATION } from '../../../config/const';
import AllChatbotFlows from './components/AllChatbotFlows';

export default function ChatbotFlow() {
	const outlet = useOutlet();
	if (outlet) {
		return outlet;
	}
	return (
		<Flex
			direction={'column'}
			gap={'1rem'}
			className='custom-scrollbar'
			justifyContent={'center'}
			p={'1rem'}
		>
			<HStack justifyContent={'space-between'}>
				<Text fontSize={'2xl'} fontWeight={'bold'}>
					ChatBot Flow
				</Text>
				<Link to={`${NAVIGATION.APP}/${NAVIGATION.CHATBOT_FLOW}/new`}>
					<Button variant='outline' size={'sm'} colorScheme='green' leftIcon={<AddIcon />}>
						Create
					</Button>
				</Link>
			</HStack>
			<AllChatbotFlows />
		</Flex>
	);
}
