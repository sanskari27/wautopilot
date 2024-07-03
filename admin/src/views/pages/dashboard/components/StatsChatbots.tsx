import { Stat, StatLabel, StatNumber } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { StoreNames, StoreState } from '../../../../store';

export default function Chatbots() {
	const { list } = useSelector((state: StoreState) => state[StoreNames.CHATBOT]);

	const activeChatbots = list.filter((chatbot) => chatbot.isActive);

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
			<StatLabel>Total Chatbots</StatLabel>
			<StatNumber>{list.length}</StatNumber>
			<StatLabel>Active</StatLabel>
			<StatNumber>{activeChatbots.length}</StatNumber>
		</Stat>
	);
}
