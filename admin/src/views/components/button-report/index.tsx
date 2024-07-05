import {
	Box,
	Button,
	Flex,
	Table,
	TableContainer,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import Chart from 'react-google-charts';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import MessagesService from '../../../services/messages.service';
import { StoreNames, StoreState } from '../../../store';
import Each from '../utils/Each';

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

export default function ButtonResponse() {
	const toast = useToast();
	const { campaignId } = useParams();

	const { selected_device_id } = useSelector((state: StoreState) => state[StoreNames.USER]);

	const [buttonResponse, setButtonResponse] = useState<
		{
			button_text: string;
			recipient: string;
			responseAt: string;
			name: string;
			email: string;
		}[]
	>([]);

	useEffect(() => {
		if (!campaignId) {
			toast({
				title: 'Report not found!',
				status: 'error',
			});
		} else {
			toast.promise(
				MessagesService.buttonResponseReport({ deviceId: selected_device_id, campaignId }),
				{
					loading: { title: 'Loading...' },
					success: (res) => {
						if (res) {
							setButtonResponse(res);
						}
						return { title: 'Report fetched successfully!' };
					},
					error: { title: 'Failed to fetch report!' },
				}
			);
		}
	}, [campaignId, selected_device_id, toast]);

	const handleExport = () => {
		if (!campaignId) return;
		toast.promise(
			MessagesService.buttonResponseReport({
				deviceId: selected_device_id,
				campaignId,
				exportCSV: true,
			}),
			{
				loading: { title: 'Downloading...' },
				success: (res) => {
					if (res) {
						setButtonResponse(res);
					}
					return { title: 'Report downloaded successfully!' };
				},
				error: { title: 'Unable to download!' },
			}
		);
	};
	const mappedData = buttonResponse.reduce((acc, item) => {
		if (acc.has(item.button_text)) {
			acc.set(item.button_text, acc.get(item.button_text)! + 1);
		} else {
			acc.set(item.button_text, 1);
		}
		return acc;
	}, new Map<string, number>());

	function getData() {
		const barGraphData = [...mappedData.keys()].reduce((acc, key, index) => {
			acc.push([key, mappedData.get(key)!, COLORS[index % COLORS.length]]);
			return acc;
		}, [] as [string, number, string][]);

		return [['Text', 'Count', { role: 'style' }], ...barGraphData];
	}
	console.log(getData());

	return (
		<Flex direction={'column'} padding={'1rem'} justifyContent={'start'}>
			<Flex>
				<Text fontSize={'2xl'} fontWeight={'bold'}>
					Button Responses
				</Text>
				<Flex ml={'auto'}>
					<Button colorScheme='green' mr={2} onClick={handleExport}>
						Export
					</Button>
				</Flex>
			</Flex>
			<Flex className='flex-col md:flex-row'>
				<Box flex={1}>
					<Chart chartType='ColumnChart' width='100%' height='400px' data={getData()} />
				</Box>
				<Box flex={1}>
					<Chart
						chartType='PieChart'
						width='100%'
						height='400px'
						data={getData()}
						options={{ is3D: true }}
					/>
				</Box>
			</Flex>
			<Text textAlign={'center'} fontWeight={'medium'}>
				Visual comparison of the number of times each button was clicked by the recipients.
			</Text>
			<TableContainer marginTop={'1rem'}>
				<Table variant={'striped'}>
					<Thead>
						<Tr color={'black'}>
							<Th width={'5%'}>S/N</Th>
							<Th width={'30%'}>Name</Th>
							<Th width={'30%'}>Email</Th>
							<Th width={'10%'}>Phone number</Th>
							<Th width={'20%'}>Button Text</Th>
							<Th width={'5%'}>Clicked at</Th>
						</Tr>
					</Thead>
					<Tbody>
						<Each
							items={buttonResponse}
							render={(broadcast, index) => (
								<Tr key={index} color={'black'}>
									<Td>{index + 1}.</Td>
									<Td className='whitespace-break-spaces'>{broadcast.name}</Td>
									<Td className='whitespace-break-spaces'>{broadcast.email}</Td>
									<Td>{broadcast.recipient}</Td>
									<Td className='whitespace-break-spaces'>{broadcast.button_text}</Td>
									<Td>{broadcast.responseAt}</Td>
								</Tr>
							)}
						/>
					</Tbody>
				</Table>
			</TableContainer>
		</Flex>
	);
}
