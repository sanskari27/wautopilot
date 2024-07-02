import { Flex, Text } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { StoreNames, StoreState } from '../../../../store';

export default function WalletBalance() {
	const {
		user_details: { walletBalance },
	} = useSelector((state: StoreState) => state[StoreNames.USER]);

	return (
		<Flex
			direction={'column'}
			alignItems={'center'}
			justifyContent={'center'}
			shadow={'lg'}
			rounded={'3xl'}
			height={'200px'}
			backgroundColor={'lightskyblue'}
			textAlign={'center'}
		>
			<Text fontSize={'1.5rem'} color={'darkslateblue'}>
				Wallet Balance
			</Text>
			<Text fontSize={'2.5rem'} color={'steelblue'}>
				₹{walletBalance}
			</Text>
		</Flex>
	);
}
