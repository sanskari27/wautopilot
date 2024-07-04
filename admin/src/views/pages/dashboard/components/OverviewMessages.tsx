import { Box, Text } from '@chakra-ui/react';
import { Chart } from 'react-google-charts';
import { useSelector } from 'react-redux';
import { StoreNames, StoreState } from '../../../../store';

export default function MessagesOverview() {
	const {
		details: { messages },
		ui: { isLoading },
	} = useSelector((state: StoreState) => state[StoreNames.DASHBOARD]);

	const chartData = () => {
		if (messages.length === 0) return [];
		const keys = ['DAY', 'COUNT'];
		const data = messages.map((message) => {
			return [message.day, message.count];
		});

		return [keys, ...data];
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<Box>
			<Text textAlign={'center'} fontSize={'1.25rem'} fontWeight={'medium'}>
				Messages sent this month
			</Text>
			<Chart
				chartType='AreaChart'
				width='100%'
				height='400px'
				data={chartData()}
				options={{
					hAxis: {
						titleTextStyle: { color: '#333' },
						minValue: 1,
						maxValue: 31,
					},
					vAxis: { minValue: 0 },
					chartArea: { width: '90%', height: '60%' },
					backgroundColor: 'transparent',
					legend: 'none',
				}}
			/>
		</Box>
	);
}
