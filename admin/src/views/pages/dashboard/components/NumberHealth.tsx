import { Box, Stat, StatLabel, StatNumber } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { StoreNames, StoreState } from '../../../../store';

export default function NumberHealth() {
	const {
		details: { health },
		ui: { isLoading },
	} = useSelector((state: StoreState) => state[StoreNames.DASHBOARD]);

	if (isLoading) {
		return <Box>Loading</Box>;
	}

	return (
		<Stat
			shadow={'lg'}
			rounded={'3xl'}
			height={'200px'}
			textAlign={'center'}
			bgColor={`${health.toLowerCase()}.300`}
			pt={'12%'}
		>
			<StatLabel>Number Health</StatLabel>
			<StatNumber color={`${health.toLowerCase()}.700`}>{health}</StatNumber>
		</Stat>
	);
}
