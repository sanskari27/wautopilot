import { Stat, StatLabel, StatNumber } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { StoreNames, StoreState } from '../../../../store';

export default function WalletBalance() {
	const {
		user_details: { walletBalance },
	} = useSelector((state: StoreState) => state[StoreNames.USER]);

	return (
		<Stat
			shadow={'lg'}
			rounded={'3xl'}
			height={'200px'}
			textAlign={'center'}
			bgColor={'blue.200'}
			pt={'12%'}
		>
			<StatLabel>Wallet Balance</StatLabel>
			<StatNumber>₹{walletBalance}</StatNumber>
		</Stat>
	);
}
