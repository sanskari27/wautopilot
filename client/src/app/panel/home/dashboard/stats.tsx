'use client';
import { useUserDetails } from '@/components/context/user-details';
import { getFormattedDay, getMonth } from '@/lib/utils';
import { Chart } from 'react-google-charts';
import StatsTemplate from './statsTemplate';

export function WalletBalance() {
	const details = useUserDetails();
	return (
		<StatsTemplate
			label={'Wallet Balance'}
			value={'₹' + details.walletBalance}
			className={'bg-blue-200'}
		/>
	);
}

export function MessagesOverview({
	data,
}: {
	data: {
		month: number;
		day: number;
		count: number;
	}[];
}) {
	const chartData = () => {
		if (data.length === 0) return [];
		const keys = ['DAY', 'COUNT'];
		const _data = data.map((message) => {
			return [getFormattedDay(message.day), message.count];
		});

		return [keys, ..._data];
	};
	const currentMonth = getMonth(new Date().getMonth() + 1, true);

	return (
		<div>
			<p className='text-center text-xl font-medium'>Messages sent in {currentMonth}</p>
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
		</div>
	);
}

export function ConversationOverview({
	data,
}: {
	data: {
		month: number;
		year: number;
		count: number;
	}[];
}) {
	const chartData = () => {
		if (data.length === 0) return [];
		const keys = ['MONTH', 'COUNT'];
		const _data = data.map((c) => [`${getMonth(c.month)} ${c.year}`, c.count]);

		return [keys, ..._data];
	};

	return (
		<div>
			<p className='text-center text-xl font-medium'>Conversations Started per month</p>
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
		</div>
	);
}
