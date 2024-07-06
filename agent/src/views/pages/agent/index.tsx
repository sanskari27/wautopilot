import { Flex, HStack, Text } from '@chakra-ui/react';
import { useOutlet } from 'react-router-dom';
import AllAgents from './components/AllAgents';

export default function AgentPage() {
	const outlet = useOutlet();

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
			</HStack>
			<AllAgents />
			{outlet}
		</Flex>
	);
}
