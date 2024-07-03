import { Box, Text } from '@chakra-ui/react';
import { Chart } from 'react-google-charts';
import { useSelector } from 'react-redux';
import { StoreNames, StoreState } from '../../../../store';
import { getMonth } from '../../../../utils/date-utils';

// export const data = [
// 	['Year', 'Sales', 'Expenses'],
// 	['2013', 1000, 400],
// 	['2014', 1170, 460],
// 	['2015', 660, 1120],
// 	['2017', 1030, 540],
// 	['2018', 1050, 540],
// 	['2019', 100, 1040],
// ];

export default function MessagesOverview() {
	const {
		details: { messages },
		ui: { isLoading },
	} = useSelector((state: StoreState) => state[StoreNames.DASHBOARD]);

	const chartData = () => {
		if (messages.length === 0) return [];
		const keys = ['DAY', 'COUNT'];
		const data = messages.map((message) => {
			return [message.day + ' ' + getMonth(message.month), message.count];
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
