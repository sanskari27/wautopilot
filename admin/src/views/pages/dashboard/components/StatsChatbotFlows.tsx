import { Stat, StatLabel, StatNumber } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { StoreNames, StoreState } from '../../../../store';

export default function PendingMessages() {
	const { list } = useSelector((state: StoreState) => state[StoreNames.CHATBOT_FLOW]);
	const activeChatbotFlows = list.filter((chatbotFlow) => chatbotFlow.isActive);

	return (
		<Stat
			shadow={'lg'}
			rounded={'3xl'}
			height={'200px'}
			textAlign={'center'}
			bgColor={'thistle'}
			pt={'8%'}
			width={'200px'}
		>
			<StatLabel>Total Chatbot Flows</StatLabel>
			<StatNumber>{list.length}</StatNumber>
			<StatLabel>Active</StatLabel>
			<StatNumber>{activeChatbotFlows.length}</StatNumber>
		</Stat>
	);
}
