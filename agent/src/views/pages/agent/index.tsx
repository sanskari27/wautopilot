import { AddIcon } from '@chakra-ui/icons';
import { Button, Flex, HStack, Text } from '@chakra-ui/react';
import { useNavigate, useOutlet } from 'react-router-dom';
import { NAVIGATION } from '../../../config/const';
import AllAgents from './components/AllAgents';

export default function AgentPage() {
	const outlet = useOutlet();
	const navigate = useNavigate();

	return (
		<Flex
			direction={'column'}
			gap={'0.5rem'}
			className='custom-scrollbar'
			justifyContent={'center'}
			p={'1rem'}
		>
			<HStack justifyContent={'space-between'}>
				<Text fontSize={'2xl'} fontWeight={'bold'}>
					Agents
				</Text>
				<Button
					onClick={() => navigate(`${NAVIGATION.APP}/${NAVIGATION.AGENT}/new`)}
					variant='outline'
					size={'sm'}
					colorScheme='green'
					leftIcon={<AddIcon />}
				>
					Create Agents
				</Button>
			</HStack>
			<AllAgents />
			{outlet}
		</Flex>
	);
}
