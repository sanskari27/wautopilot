import { AddIcon } from '@chakra-ui/icons';
import { Button, Flex, HStack, Text } from '@chakra-ui/react';
import { useRef } from 'react';
import AllAgents from './components/AllAgents';
import CreateAgentDialog, { AgentDialogHandle } from './components/CreateAgentdialog';

export default function AgentPage() {
	const CreateAgentDialogRef = useRef<AgentDialogHandle>(null);
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
					onClick={() => CreateAgentDialogRef.current?.open()}
					variant='outline'
					size={'sm'}
					colorScheme='green'
					leftIcon={<AddIcon />}
				>
					Create Agents
				</Button>
			</HStack>
			<AllAgents />
			<CreateAgentDialog ref={CreateAgentDialogRef} />
		</Flex>
	);
}
