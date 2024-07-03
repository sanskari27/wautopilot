import { Box, Flex, Text } from '@chakra-ui/react';
import NumberHealth from './components/NumberHealth';
import ConversationOverview from './components/OverviewConversation';
import MessagesOverview from './components/OverviewMessages';
import PendingMessages from './components/StatsChatbotFlows';
import Chatbots from './components/StatsChatbots';
import PhonebookContact from './components/StatsContactsPhonebook';
import MediaStorage from './components/StatsMediaStorage';
import TemplateStats from './components/StatsTemplates';
import TotalConversations from './components/StatsTotalConversations';
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
				<Box
					shadow={'lg'}
					rounded={'3xl'}
					p={'1rem'}
					height={'420px'}
					className='md:w-3/4 w-full'
					bgColor={'whitesmoke'}
				>
					<ConversationOverview />
				</Box>
				<Flex direction={'column'} className='md:w-1/4 w-full' gap={'1rem'}>
					<Flex gap={'1rem'}>
						<WalletBalance />
						<NumberHealth />
					</Flex>
					<Flex gap={'1rem'}>
						<TotalConversations />
						<MediaStorage />
					</Flex>
				</Flex>
			</Flex>
			<Flex gap={'1rem'} className='flex-col md:flex-row'>
				<Box
					shadow={'lg'}
					rounded={'3xl'}
					p={'1rem'}
					height={'420px'}
					className='md:w-3/4 w-full'
					bgColor={'whitesmoke'}
				>
					<MessagesOverview />
				</Box>
				<Flex direction={'column'} className='md:w-1/4 w-full' gap={'1rem'}>
					<Flex gap={'1rem'}>
						<TemplateStats />
						<PhonebookContact />
					</Flex>
					<Flex gap={'1rem'}>
						<Chatbots />
						<PendingMessages />
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
}
