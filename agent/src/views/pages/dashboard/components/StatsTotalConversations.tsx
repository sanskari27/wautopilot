import { Stat, StatLabel, StatNumber } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { StoreNames, StoreState } from '../../../../store';

export default function TotalConversations() {
	const { list } = useSelector((state: StoreState) => state[StoreNames.RECIPIENT]);
	const {
		details: { pendingToday },
	} = useSelector((state: StoreState) => state[StoreNames.DASHBOARD]);

	return (
		<Stat
			shadow={'lg'}
			rounded={'3xl'}
			height={'200px'}
			textAlign={'center'}
			bgColor={'wheat'}
			pt={'8%'}
			flex={1}
			width={'200px'}
			maxWidth={'200px'}
		>
			<StatLabel>Total Conversations</StatLabel>
			<StatNumber>{list.length}</StatNumber>

			<StatLabel>Pending Messages</StatLabel>
			<StatNumber>{pendingToday}</StatNumber>
		</Stat>
	);
}
