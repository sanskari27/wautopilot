'use client';

import Each from '@/components/containers/each';
import Show from '@/components/containers/show';
import { Button } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import BroadcastService from '@/services/broadcast.service';
import Chart from 'react-google-charts';
import toast from 'react-hot-toast';

const COLORS = [
	'#FF6633',
	'#FF33FF',
	'#FFFF99',
	'#00B3E6',
	'#FFB399',
	'#3366E6',
	'#E6B333',
	'#999966',
	'#99FF99',
	'#B34D4D',
	'#809900',
	'#E6B3B3',
	'#80B300',
	'#6680B3',
	'#66991A',
	'#FF99E6',
	'#CCFF1A',
	'#FF1A66',
	'#33FFCC',
	'#E6331A',
];

export default function ResponseDataTable({
	list,
	id,
}: {
	id: string;
	list: {
		button_text: string;
		recipient: string;
		responseAt: string;
		name: string;
		email: string;
	}[];
}) {
	const handleExport = () => {
		if (!id) return;
		toast.promise(
			BroadcastService.buttonResponseReport({
				campaignId: id,
				exportCSV: true,
			}),
			{
				loading: 'Downloading...',
				success: 'Report downloaded successfully!',
				error: 'Unable to download!',
			}
		);
	};

	const mappedData = list.reduce((acc, item) => {
		if (acc.has(item.button_text)) {
			acc.set(item.button_text, acc.get(item.button_text)! + 1);
		} else {
			acc.set(item.button_text, 1);
		}
		return acc;
	}, new Map<string, number>());

	function getData() {
		const barGraphData = Array.from(mappedData.keys()).reduce((acc, key, index) => {
			acc.push([key, mappedData.get(key)!, COLORS[index % COLORS.length]]);
			return acc;
		}, [] as [string, number, string][]);

		return [['Text', 'Count', { role: 'style' }], ...barGraphData];
	}

	return (
		<div>
			<div className='justify-between flex'>
				<h2 className='text-2xl font-bold'>Button Response</h2>
				<div className='flex gap-x-2 gap-y-1 flex-wrap '>
					<Button onClick={handleExport} size={'sm'}>
						Export
					</Button>
				</div>
			</div>
			<div hidden={list.length === 0}>
				<div className=' flex flex-col md:flex-row'>
					<div className='flex-1'>
						<Chart chartType='ColumnChart' width='100%' height='400px' data={getData()} />
					</div>
					<div className='flex-1'>
						<Chart
							chartType='PieChart'
							width='100%'
							height='400px'
							data={getData()}
							options={{ is3D: true }}
						/>
					</div>
				</div>
				<p className='text-center font-medium'>
					Visual comparison of the number of times each button was clicked by the recipients.
				</p>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>S/N</TableHead>
						<TableHead>Name</TableHead>
						<TableHead>Email</TableHead>
						<TableHead className='text-right'>Phone No</TableHead>
						<TableHead>Button Text</TableHead>
						<TableHead>Clicked At</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<Show>
						<Show.When condition={list.length === 0}>
							<TableRow>
								<TableCell colSpan={6} className='text-center'>
									No data available
								</TableCell>
							</TableRow>
						</Show.When>
					</Show>
					<Each
						items={list}
						render={(report, index) => {
							return (
								<TableRow>
									<TableCell className='font-medium'>{index + 1}</TableCell>
									<TableCell className='font-medium'>{report.name}</TableCell>
									<TableCell>{report.email}</TableCell>
									<TableCell className='text-right'>{report.recipient}</TableCell>
									<TableCell>{report.button_text}</TableCell>
									<TableCell>{report.responseAt}</TableCell>
								</TableRow>
							);
						}}
					/>
				</TableBody>
			</Table>
		</div>
	);
}
