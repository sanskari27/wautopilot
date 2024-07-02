import { AddIcon } from '@chakra-ui/icons';
import { Button, Flex, HStack, Text } from '@chakra-ui/react';
import { Link, useOutlet } from 'react-router-dom';
import { NAVIGATION } from '../../../config/const';

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
					ChatBots
				</Text>
				<Link to={`${NAVIGATION.APP}/${NAVIGATION.CHATBOT_FLOW}/new`}>
					<Button variant='outline' size={'sm'} colorScheme='green' leftIcon={<AddIcon />}>
						Create Flow
					</Button>
				</Link>
			</HStack>
		</Flex>
	);
}
