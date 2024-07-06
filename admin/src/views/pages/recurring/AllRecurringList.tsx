import { ChevronDownIcon } from '@chakra-ui/icons';
import {
	Button,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Skeleton,
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
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { NAVIGATION } from '../../../config/const';
import RecurringService from '../../../services/recurring.service';
import { StoreNames, StoreState } from '../../../store';
import { removeRecurring, toggleRecurring } from '../../../store/reducers/RecurringReducer';
import ConfirmationAlert, { ConfirmationAlertHandle } from '../../components/confirmation-alert';
import DeleteAlert, { DeleteAlertHandle } from '../../components/delete-alert';
import Each from '../../components/utils/Each';

export default function AllRecurringList() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const toast = useToast();
	const {
		list,
		ui: { isLoading },
	} = useSelector((state: StoreState) => state[StoreNames.RECURRING]);
	const { selected_device_id } = useSelector((state: StoreState) => state[StoreNames.USER]);
	const deleteAlertRef = useRef<DeleteAlertHandle>(null);
	const confirmationAlertRef = useRef<ConfirmationAlertHandle>(null);

	const deleteBot = (id: string) => {
		const promise = RecurringService.deleteRecurring({
			deviceId: selected_device_id,
			recurringId: id,
		});
		toast.promise(promise, {
			success: () => {
				dispatch(removeRecurring(id));
				return { title: 'Recurring deleted successfully', status: 'success' };
			},
			error: { title: 'Failed to delete Recurring' },
			loading: { title: 'Deleting Recurring...' },
		});
	};

	const toggleBot = (id: string) => {
		const promise = RecurringService.toggleRecurring({
			deviceId: selected_device_id,
			recurringId: id,
		});
		toast.promise(promise, {
			success: () => {
				dispatch(toggleRecurring(id));
				return { title: 'Recurring toggled successfully', status: 'success' };
			},
			error: { title: 'Failed to toggle Recurring' },
			loading: { title: 'Toggling Recurring...' },
		});
	};

	const handleReschedule = (id: string) => {
		const promise = RecurringService.rescheduleRecurring({
			deviceId: selected_device_id,
			recurringId: id,
		});

		toast.promise(promise, {
			success: {
				title: 'Recurring rescheduled successfully',
			},
			error: { title: 'Failed to reschedule Recurring' },
			loading: { title: 'Rescheduling Recurring...' },
		});
	};

	const handleDownload = (id: string) => {
		const promise = RecurringService.downloadRecurring({
			deviceId: selected_device_id,
			recurringId: id,
		});

		toast.promise(promise, {
			success: {
				title: 'Recurring report downloaded successfully',
			},
			error: { title: 'Failed to download Recurring report' },
			loading: { title: 'Downloading Recurring report...' },
		});
	};

	const handleEditBot = (id: string) => {
		navigate(`${NAVIGATION.APP}/${NAVIGATION.RECURRING}/${id}`);
	};

	return (
		<>
			<TableContainer border={'1px dashed gray'} rounded={'2xl'}>
				<Table variant='striped' colorScheme='gray'>
					<Thead>
						<Tr>
							<Th width={'35%'}>Name</Th>
							<Th width={'35%'}>Description</Th>
							<Th width={'5%'}>Wish type</Th>
							<Th width={'5%'}>Delay</Th>
							<Th width={'10%'}>Actions</Th>
						</Tr>
					</Thead>
					<Tbody>
						{isLoading ? (
							<>
								<Tr>
									<Td colSpan={6}>
										<Skeleton height={'2rem'} width={'100%'} />
									</Td>
								</Tr>
								<Tr>
									<Td colSpan={6}>
										<Skeleton height={'2rem'} width={'100%'} />
									</Td>
								</Tr>
								<Tr>
									<Td colSpan={6}>
										<Skeleton height={'2rem'} width={'100%'} />
									</Td>
								</Tr>
								<Tr>
									<Td colSpan={6}>
										<Skeleton height={'2rem'} width={'100%'} />
									</Td>
								</Tr>
							</>
						) : (
							<Each
								items={list}
								render={(recurring, index) => (
									<Tr key={index}>
										<Td>{recurring.name}</Td>
										<Td className='whitespace-break-spaces'>{recurring.description}</Td>
										<Td>{recurring.wish_from}</Td>
										<Td>{recurring.delay} Days</Td>
										<Td>
											<Menu>
												<MenuButton as={Button} rightIcon={<ChevronDownIcon />} size='sm'>
													Actions
												</MenuButton>
												<MenuList>
													<MenuItem onClick={() => handleEditBot(recurring.id)}>Edit</MenuItem>
													<MenuItem
														onClick={() =>
															confirmationAlertRef.current?.open({
																id: recurring.id,
																disclaimer: 'Are you sure you want to change running status?',
																type: 'TOGGLE_BOT',
															})
														}
													>
														<Text color={recurring.active ? 'red' : 'green'}>
															{recurring.active ? 'Stop' : 'Play'}
														</Text>
													</MenuItem>
													<MenuItem onClick={() => handleDownload(recurring.id)}>
														Download Report
													</MenuItem>
													<MenuItem
														onClick={() =>
															navigate(
																`${NAVIGATION.APP}/${NAVIGATION.CHATBOT}/button-report/${recurring.id}`
															)
														}
													>
														Button Click Report
													</MenuItem>
													<MenuItem onClick={() => handleReschedule(recurring.id)}>
														Reschedule Today's Messages
													</MenuItem>
													<MenuItem onClick={() => deleteAlertRef.current?.open(recurring.id)}>
														Delete
													</MenuItem>
												</MenuList>
											</Menu>
										</Td>
									</Tr>
								)}
							/>
						)}
					</Tbody>
				</Table>
			</TableContainer>
			<DeleteAlert type={'Recurring Message'} ref={deleteAlertRef} onConfirm={deleteBot} />
			<ConfirmationAlert ref={confirmationAlertRef} onConfirm={toggleBot} disclaimer='' />
		</>
	);
}
