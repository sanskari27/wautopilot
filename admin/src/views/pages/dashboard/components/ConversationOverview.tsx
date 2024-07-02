import { Box } from '@chakra-ui/react';
import { Chart } from 'react-google-charts';
import { useSelector } from 'react-redux';
import { StoreNames, StoreState } from '../../../../store';

export const data = [
	['Year', 'Sales', 'Expenses'],
	['2013', 1000, 400],
	['2014', 1170, 460],
	['2015', 660, 1120],
	['2017', 1030, 540],
	['2018', 1050, 540],
	['2019', 100, 1040],
];

export const options = {
	title: 'Conversation Overview',
	hAxis: { title: 'Year', titleTextStyle: { color: '#333' } },
	vAxis: { minValue: 0 },
	chartArea: { width: '90%', height: '70%' },
	backgroundColor: '#eee',
	animation: {
		startup: true,
		easing: 'linear',
		duration: 500,
	},
};

export default function ConversationOverview() {
	const { conversations } = useSelector((state: StoreState) => state[StoreNames.DASHBOARD]);

	return (
		<Box
			shadow={'lg'}
			rounded={'3xl'}
			p={'1rem'}
			height={'420px'}
			className='md:w-3/4 w-full'
			bgColor={'#eee'}
		>
			<Chart chartType='AreaChart' width='100%' height='400px' data={data} options={options} />
		</Box>
	);
}
