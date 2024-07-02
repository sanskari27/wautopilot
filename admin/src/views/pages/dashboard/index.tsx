import { Flex, Text } from '@chakra-ui/react';
import ConversationOverview from './components/ConversationOverview';
import NumberHealth from './components/NumberHealth';
import WalletBalance from './components/WalletBalance';

export default function Dashboard() {
	return (
		<Flex
			direction={'column'}
			gap={'1rem'}
			className='custom-scrollbar'
			justifyContent={'center'}
			p={'1rem'}
		>
			<Text fontSize={'2xl'} fontWeight={'bold'}>
				Dashboard
			</Text>
			<Flex gap={'1rem'} className='flex-col md:flex-row'>
				<ConversationOverview />
				<Flex className='md:w-1/4 w-full flex-col md:flex-col' gap={'1rem'}>
					<WalletBalance />
					<NumberHealth />
				</Flex>
			</Flex>
		</Flex>
	);
}
