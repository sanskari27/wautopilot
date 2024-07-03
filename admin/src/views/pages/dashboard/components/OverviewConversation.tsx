import { Box, Text } from '@chakra-ui/react';
import { Chart } from 'react-google-charts';
import { useSelector } from 'react-redux';
import { StoreNames, StoreState } from '../../../../store';
import { getMonth } from '../../../../utils/date-utils';

export default function ConversationOverview() {
	const {
		details: { conversations },
		ui: { isLoading },
	} = useSelector((state: StoreState) => state[StoreNames.DASHBOARD]);
	const { list } = useSelector((state: StoreState) => state[StoreNames.RECIPIENT]);

	const chartData = () => {
		if (conversations.length === 0) return [];
		const keys = ['MONTH', 'COUNT'];
		const data = conversations.map((conversation) => {
			return [
				getMonth(conversation.month) + ' ' + conversation.year,
				list.length - conversation.count,
			];
		});

		return [keys, ...data];
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<Box>
			<Text textAlign={'center'} fontSize={'1.25rem'} fontWeight={'medium'}>
				Conversations
			</Text>
			<Chart
				chartType='AreaChart'
				width='100%'
				height='400px'
				data={chartData()}
				options={{
					hAxis: { titleTextStyle: { color: '#333' } },
					vAxis: { minValue: 0 },
					chartArea: { width: '90%', height: '60%' },
					backgroundColor: 'transparent',
					legend: 'none',
				}}
			/>
		</Box>
	);
}
