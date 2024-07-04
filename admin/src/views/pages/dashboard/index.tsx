import { Box, Flex, Text } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { StoreNames, StoreState } from '../../../store';
import { getFileSize } from '../../../utils/file-utils';
import ConversationOverview from './components/OverviewConversation';
import MessagesOverview from './components/OverviewMessages';
import StatsTemplate from './components/StatsTemplate';
import TotalConversations from './components/StatsTotalConversations';

export default function Dashboard() {
	const {
		user_details: { walletBalance },
	} = useSelector((state: StoreState) => state[StoreNames.USER]);

	const {
		details: { health, phoneRecords, mediaSize },
		ui: { isLoading },
	} = useSelector((state: StoreState) => state[StoreNames.DASHBOARD]);

	const { list: templateList } = useSelector((state: StoreState) => state[StoreNames.TEMPLATES]);
	const approvedTemplateList = templateList.map((template) => template.status === 'approved');

	const { list: chatbotList } = useSelector((state: StoreState) => state[StoreNames.CHATBOT]);
	const activeChatbots = chatbotList.filter((chatbot) => chatbot.isActive);

	const { list: chatbotFlows } = useSelector((state: StoreState) => state[StoreNames.CHATBOT_FLOW]);
	const activeChatbotFlows = chatbotFlows.filter((chatbotFlow) => chatbotFlow.isActive);

	const { list: contactList } = useSelector((state: StoreState) => state[StoreNames.CONTACT]);

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
					className='w-full'
					bgColor={'whitesmoke'}
				>
					<ConversationOverview />
				</Box>
				<Flex direction={'column'} gap={'1rem'}>
					<Flex gap={'1rem'}>
						<StatsTemplate
							isLoading={isLoading}
							label={'Wallet Balance'}
							value={'₹' + walletBalance}
							bgColor={'blue.200'}
						/>
						<StatsTemplate
							isLoading={isLoading}
							label={'Number Health'}
							value={health}
							bgColor={isLoading ? 'green.200' : `${health.toLocaleLowerCase()}.200`}
						/>
					</Flex>
					<Flex gap={'1rem'}>
						<TotalConversations />
						<StatsTemplate
							isLoading={isLoading}
							label={'Media Storage'}
							value={getFileSize(mediaSize)}
							bgColor={'thistle'}
						/>
					</Flex>
				</Flex>
			</Flex>
			<Flex gap={'1rem'} className='flex-col md:flex-row-reverse'>
				<Box
					shadow={'lg'}
					rounded={'3xl'}
					p={'1rem'}
					height={'420px'}
					className='w-full'
					bgColor={'whitesmoke'}
				>
					<MessagesOverview />
				</Box>
				<Flex direction={'column'} gap={'1rem'}>
					<Flex gap={'1rem'}>
						<StatsTemplate
							isLoading={isLoading}
							label='Templates(Approved)'
							value={`${templateList.length.toString()}(${approvedTemplateList.length.toString()})`}
							bgColor='blue.200'
						/>
						<StatsTemplate
							isLoading={isLoading}
							label='Phonebook/Contacts'
							value={`${phoneRecords}/${contactList.length.toString()}`}
							bgColor='blue.200'
						/>
					</Flex>
					<Flex gap={'1rem'}>
						<StatsTemplate
							isLoading={isLoading}
							label='Chatbots(Active)'
							value={`${chatbotList.length.toString()}(${activeChatbots.length.toString()})`}
							bgColor='turquoise'
						/>
						<StatsTemplate
							isLoading={isLoading}
							label='Flows(Active)'
							value={`${chatbotFlows.length.toString()}(${activeChatbotFlows.length.toString()})`}
							bgColor='cornsilk'
						/>
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
}
