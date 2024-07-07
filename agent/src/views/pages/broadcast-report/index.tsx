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
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useOutlet } from 'react-router-dom';
import { NAVIGATION } from '../../../config/const';
import useFilteredList from '../../../hooks/useFilteredList';
import usePermissions from '../../../hooks/usePermissions';
import BroadcastService from '../../../services/broadcast.service';
import { StoreNames, StoreState } from '../../../store';
import Each from '../../components/utils/Each';
import Show from '../../components/utils/Show';

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
	const navigate = useNavigate();
	const [list, setList] = useState<ScheduledBroadcast[]>([]);
	const [campaignLoading, setCampaignLoading] = useBoolean(true);
	const toast = useToast();
	const outlet = useOutlet();

	const [selectedBroadcast, setSelectedBroadcast] = useState<string[]>([]);

	const { broadcast: permission } = usePermissions();
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
		BroadcastService.broadcastReport(selected_device_id)
			.then(setList)
			.finally(() => {
				setCampaignLoading.off();
			});
	}, [setCampaignLoading, selected_device_id]);

	useEffect(() => {
		fetchBroadcast();
	}, [fetchBroadcast]);

	const removeCampaignList = (campaign_id: string) => {
		setSelectedBroadcast((prev) => prev.filter((campaign) => campaign !== campaign_id));
	};

	const addCampaignList = (id: string) => {
		setSelectedBroadcast((prev) => [...prev, id]);
	};

	const handleExport = () => {
		if (selectedBroadcast.length === 0) {
			toast({
				title: 'No broadcast selected',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
			return;
		}
		const promises = selectedBroadcast.map(async (id) =>
			BroadcastService.downloadBroadcast(selected_device_id, id)
		);
		toast.promise(Promise.all(promises), {
			success: { title: 'Downloaded successfully' },
			error: { title: 'Failed to download broadcast report' },
			loading: { title: 'Downloading...' },
		});
	};

	const { filtered } = useFilteredList(list, { name: 1 });
	if (outlet) {
		return outlet;
	}

	return (
		<Flex direction={'column'} padding={'1rem'} justifyContent={'start'}>
			<Flex>
				<Text fontSize={'2xl'} fontWeight={'bold'}>
					Broadcast Report
				</Text>
				<Flex ml={'auto'}>
					<Show>
						<Show.When condition={permission.export}>
							<Button colorScheme='green' mr={2} onClick={handleExport}>
								Export
							</Button>
						</Show.When>
					</Show>
				</Flex>
			</Flex>
			<TableContainer border={'1px dashed gray'} rounded={'2xl'} mt={'1rem'}>
				<Table variant='striped' colorScheme='gray'>
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
						<Show>
							<Show.When condition={campaignLoading && list.length === 0}>
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
							</Show.When>
							<Show.Else>
								<Each
									items={filtered}
									render={(broadcast, index) => (
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
											<Td
												onClick={() =>
													navigate(
														`${NAVIGATION.APP}/${NAVIGATION.BROADCAST_REPORT}/button-report/${broadcast.broadcast_id}`
													)
												}
												cursor={'pointer'}
												className='whitespace-break-spaces'
											>
												{broadcast.name}
											</Td>
											<Td
												onClick={() =>
													navigate(
														`${NAVIGATION.APP}/${NAVIGATION.BROADCAST_REPORT}/button-report/${broadcast.broadcast_id}`
													)
												}
												cursor={'pointer'}
												className='whitespace-break-spaces'
											>
												{broadcast.description}
											</Td>
											<Td
												onClick={() =>
													navigate(
														`${NAVIGATION.APP}/${NAVIGATION.BROADCAST_REPORT}/button-report/${broadcast.broadcast_id}`
													)
												}
												cursor={'pointer'}
												textAlign={'center'}
											>
												{broadcast.createdAt}
											</Td>
											<Td
												onClick={() =>
													navigate(
														`${NAVIGATION.APP}/${NAVIGATION.BROADCAST_REPORT}/button-report/${broadcast.broadcast_id}`
													)
												}
												cursor={'pointer'}
												textColor={'green'}
											>
												{broadcast.sent}
											</Td>
											<Td
												onClick={() =>
													navigate(
														`${NAVIGATION.APP}/${NAVIGATION.BROADCAST_REPORT}/button-report/${broadcast.broadcast_id}`
													)
												}
												cursor={'pointer'}
												textColor={'yellow.500'}
											>
												{broadcast.pending}
											</Td>
											<Td
												onClick={() =>
													navigate(
														`${NAVIGATION.APP}/${NAVIGATION.BROADCAST_REPORT}/button-report/${broadcast.broadcast_id}`
													)
												}
												cursor={'pointer'}
												textColor={'red.400'}
											>
												{broadcast.failed}
											</Td>
											<Td>
												<Show>
													<Show.When condition={broadcast.isPaused && permission.update}>
														<Button
															size={'sm'}
															colorScheme='green'
															onClick={() => {
																BroadcastService.resumeBroadcast(
																	selected_device_id,
																	broadcast.broadcast_id
																).then(() => {
																	fetchBroadcast();
																});
															}}
														>
															Resume
														</Button>
													</Show.When>
													<Show.When condition={broadcast.pending > 0 && permission.update}>
														<Button
															size={'sm'}
															colorScheme='red'
															onClick={() => {
																BroadcastService.pauseBroadcast(
																	selected_device_id,
																	broadcast.broadcast_id
																).then(() => {
																	fetchBroadcast();
																});
															}}
														>
															Pause
														</Button>
													</Show.When>
													<Show.When condition={broadcast.failed > 0 && permission.update}>
														<Button
															size={'sm'}
															colorScheme='orange'
															onClick={() => {
																BroadcastService.resendFailedBroadcast(
																	selected_device_id,
																	broadcast.broadcast_id
																).then(() => {
																	fetchBroadcast();
																});
															}}
														>
															Resend Failed
														</Button>
													</Show.When>
												</Show>
											</Td>
										</Tr>
									)}
								/>
							</Show.Else>
						</Show>
					</Tbody>
				</Table>
			</TableContainer>
		</Flex>
	);
}

function LineSkeleton() {
	return <SkeletonText mt='4' noOfLines={1} spacing='4' skeletonHeight='4' rounded={'md'} />;
}
