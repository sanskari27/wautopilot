import { Stat, StatLabel, StatNumber } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { StoreNames, StoreState } from '../../../../store';

export default function StatsTemplate({
	label,
	value,
	bgColor,
	isLoading,
}: {
	label: string;
	value: string;
	bgColor: string;
	isLoading: boolean;
}) {
	useSelector((state: StoreState) => state[StoreNames.DASHBOARD]);

	return (
		<Stat
			shadow={'lg'}
			rounded={'3xl'}
			height={'200px'}
			textAlign={'center'}
			bgColor={bgColor}
			pt={'12%'}
			flex={1}
			width={'200px'}
			maxWidth={'200px'}
		>
			<StatLabel>{label}</StatLabel>

			<StatNumber>{isLoading ? 'Loading...' : value}</StatNumber>
		</Stat>
	);
}
