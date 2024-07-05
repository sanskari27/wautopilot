import { DownloadIcon, EditIcon } from '@chakra-ui/icons';
import {
	IconButton,
	Skeleton,
	Table,
	TableContainer,
	Tbody,
	Td,
	Th,
	Thead,
	Tooltip,
	Tr,
	useToast,
} from '@chakra-ui/react';
import { useRef } from 'react';
import { MdDelete, MdScheduleSend } from 'react-icons/md';
import { PiPause, PiPlay } from 'react-icons/pi';
import { TbReportSearch } from 'react-icons/tb';
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
			<TableContainer>
				<Table>
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
											<Tooltip label='Delete Recurring' aria-label='Delete Responder'>
												<IconButton
													aria-label='Delete'
													icon={<MdDelete />}
													color={'red.400'}
													onClick={() => {
														deleteAlertRef.current?.open(recurring.id);
													}}
													bgColor={'transparent'}
													_hover={{
														bgColor: 'transparent',
													}}
													outline='none'
													border='none'
												/>
											</Tooltip>
											<Tooltip label='Edit Recurring' aria-label='Edit Responder'>
												<IconButton
													aria-label='Edit'
													icon={<EditIcon />}
													color={'yellow.400'}
													onClick={() => handleEditBot(recurring.id)}
													bgColor={'transparent'}
													_hover={{
														bgColor: 'transparent',
													}}
													outline='none'
													border='none'
												/>
											</Tooltip>
											<Tooltip label='Toggle Recurring' aria-label='Toggle Responder'>
												<IconButton
													aria-label='toggle'
													icon={recurring.active === 'ACTIVE' ? <PiPause /> : <PiPlay />}
													color={recurring.active === 'ACTIVE' ? 'red.400' : 'green.400'}
													onClick={() => {
														confirmationAlertRef.current?.open({
															id: recurring.id,
															disclaimer: 'Are you sure you want to change running status?',
															type: 'TOGGLE_BOT',
														});
													}}
													bgColor={'transparent'}
													_hover={{
														bgColor: 'transparent',
													}}
													outline='none'
													border='none'
												/>
											</Tooltip>
											<Tooltip label='Reschedule Recurring' aria-label='Toggle Responder'>
												<IconButton
													aria-label='toggle'
													icon={<MdScheduleSend color='gray' />}
													onClick={() => handleReschedule(recurring.id)}
													bgColor={'transparent'}
													_hover={{
														bgColor: 'transparent',
													}}
													outline='none'
													border='none'
												/>
											</Tooltip>
											<Tooltip label='Download Report' aria-label='Toggle Responder'>
												<IconButton
													aria-label='toggle'
													icon={<DownloadIcon color='blueviolet' />}
													onClick={() => handleDownload(recurring.id)}
													bgColor={'transparent'}
													_hover={{
														bgColor: 'transparent',
													}}
													outline='none'
													border='none'
												/>
											</Tooltip>
											<Tooltip label='Download Responses' aria-label='Toggle Responder'>
												<IconButton
													aria-label='toggle'
													icon={<TbReportSearch />}
													onClick={() => {
														navigate(
															`${NAVIGATION.APP}/${NAVIGATION.CHATBOT}/button-report/${recurring.id}`
														);
													}}
													bgColor={'transparent'}
													_hover={{
														bgColor: 'transparent',
													}}
													outline='none'
													border='none'
												/>
											</Tooltip>
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
