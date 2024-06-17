import {
	Button,
	Checkbox,
	Flex,
	SkeletonCircle,
	SkeletonText,
	Table,
	TableContainer,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useBoolean,
	useToast,
} from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import useFilteredList from '../../../hooks/useFilteredList';
import MessagesService from '../../../services/messages.service';
import { StoreNames, StoreState } from '../../../store';
import DeleteAlert, { DeleteAlertHandle } from '../../components/delete-alert';

export type ScheduledBroadcast = {
	broadcast_id: string;
	name: string;
	sent: number;
	failed: number;
	pending: number;
	isPaused: boolean;
	createdAt: string;
	description: string;
};

export default function BroadcastReport() {
	const [list, setList] = useState<ScheduledBroadcast[]>([]);
	const [campaignLoading, setCampaignLoading] = useBoolean(true);
	const deleteAlertRef = useRef<DeleteAlertHandle>(null);
	const toast = useToast();

	const [selectedBroadcast, setSelectedBroadcast] = useState<string[]>([]);

	const { selected_device_id } = useSelector((state: StoreState) => state[StoreNames.USER]);

	// const exportCampaign = useCallback(async (selectedCampaigns: string[]) => {
	// 	const promises = selectedCampaigns.map(async (campaign) => {
	// 		await ReportsService.generateReport(campaign);
	// 	});
	// 	await Promise.all(promises).then(() => {
	// 		setSelectedCampaign([]);
	// 	});
	// }, []);

	const fetchBroadcast = useCallback(() => {
		MessagesService.broadcastReport(selected_device_id)
			.then(setList)
			.finally(() => {
				setCampaignLoading.off();
			});
	}, [setCampaignLoading, selected_device_id]);

	useEffect(() => {
		fetchBroadcast();
	}, [fetchBroadcast]);

	const deleteCampaign = async () => {
		const promises = selectedBroadcast.map(async (campaign) => {
			await MessagesService.deleteBroadcast(selected_device_id, campaign);
		});
		toast.promise(Promise.all(promises), {
			success: () => {
				toast({
					title: 'Campaign deleted successfully',
					status: 'success',
					duration: 3000,
					isClosable: true,
				});
				setSelectedBroadcast([]);
				fetchBroadcast();
				return { title: 'Campaign deleted successfully' };
			},
			error: { title: 'Failed to delete campaign' },
			loading: { title: 'Deleting campaign...' },
		});
	};

	const removeCampaignList = (campaign_id: string) => {
		setSelectedBroadcast((prev) => prev.filter((campaign) => campaign !== campaign_id));
	};

	const addCampaignList = (id: string) => {
		setSelectedBroadcast((prev) => [...prev, id]);
	};

	const { filtered } = useFilteredList(list, { name: 1 });

	return (
		<Flex direction={'column'} padding={'1rem'} justifyContent={'start'}>
			<Flex>
				<Text fontSize={'2xl'} fontWeight={'bold'}>
					Broadcast Report
				</Text>
				<Flex ml={'auto'}>
					<Button
						colorScheme='red'
						mr={2}
						onClick={() => {
							if (selectedBroadcast.length === 0) {
								toast({
									title: 'No campaign selected',
									status: 'error',
									duration: 3000,
									isClosable: true,
								});
								return;
							}
							deleteAlertRef.current?.open();
						}}
					>
						Delete
					</Button>
				</Flex>
			</Flex>
			<TableContainer marginTop={'1rem'}>
				<Table variant={'unstyled'}>
					<Thead>
						<Tr color={'black'}>
							<Th width={'5%'}>Select</Th>
							<Th width={'30%'}>Name</Th>
							<Th width={'30%'}>Description</Th>
							<Th width={'10%'} textAlign={'center'}>
								Created At
							</Th>
							<Th width={'5%'} textColor={'green'} isNumeric>
								Sent
							</Th>
							<Th width={'5%'} textColor={'yellow.500'} isNumeric>
								Pending
							</Th>
							<Th width={'5%'} textColor={'red.400'} isNumeric>
								Failed
							</Th>
							<Th width={'10%'}>Status</Th>
						</Tr>
					</Thead>
					<Tbody>
						{campaignLoading && list.length === 0 ? (
							<Tr bg={'gray.50'} color={'black'}>
								<Td>
									<SkeletonCircle size='10' />
								</Td>
								<Td>
									<LineSkeleton />
								</Td>
								<Td>
									<LineSkeleton />
								</Td>
								<Td>
									<LineSkeleton />
								</Td>
								<Td>
									<LineSkeleton />
								</Td>
								<Td>
									<LineSkeleton />
								</Td>
								<Td>
									<LineSkeleton />
								</Td>
								<Td>
									<LineSkeleton />
								</Td>
							</Tr>
						) : (
							filtered.map((broadcast, index) => (
								<Tr key={index} color={'black'}>
									<Td>
										<Checkbox
											colorScheme='green'
											mr={4}
											isChecked={selectedBroadcast.includes(broadcast.broadcast_id)}
											onChange={(e) => {
												if (e.target.checked) {
													addCampaignList(broadcast.broadcast_id);
												} else {
													removeCampaignList(broadcast.broadcast_id);
												}
											}}
										/>
										{index + 1}.
									</Td>
									<Td className='whitespace-break-spaces'>{broadcast.name}</Td>
									<Td className='whitespace-break-spaces'>{broadcast.description}</Td>
									<Td textAlign={'center'}>{broadcast.createdAt}</Td>
									<Td textColor={'green'}>{broadcast.sent}</Td>
									<Td textColor={'yellow.500'}>{broadcast.pending}</Td>
									<Td textColor={'red.400'}>{broadcast.failed}</Td>
									<Td>
										{broadcast.isPaused ? (
											<Button
												size={'sm'}
												colorScheme='green'
												onClick={() => {
													MessagesService.resumeBroadcast(
														selected_device_id,
														broadcast.broadcast_id
													).then(() => {
														fetchBroadcast();
													});
												}}
											>
												Resume
											</Button>
										) : broadcast.pending !== 0 ? (
											<Button
												size={'sm'}
												colorScheme='red'
												onClick={() => {
													MessagesService.pauseBroadcast(
														selected_device_id,
														broadcast.broadcast_id
													).then(() => {
														fetchBroadcast();
													});
												}}
											>
												Pause
											</Button>
										) : broadcast.failed > 0 ? (
											<Button
												size={'sm'}
												colorScheme='orange'
												onClick={() => {
													MessagesService.resendFailedBroadcast(
														selected_device_id,
														broadcast.broadcast_id
													).then(() => {
														fetchBroadcast();
													});
												}}
											>
												Resend Failed
											</Button>
										) : (
											'Completed'
										)}
									</Td>
								</Tr>
							))
						)}
					</Tbody>
				</Table>
			</TableContainer>
			<DeleteAlert
				type={'Campaign'}
				ref={deleteAlertRef}
				disclaimer={'This will pause the campaign.'}
				onConfirm={deleteCampaign}
			/>
		</Flex>
	);
}

function LineSkeleton() {
	return <SkeletonText mt='4' noOfLines={1} spacing='4' skeletonHeight='4' rounded={'md'} />;
}
