import { DownloadIcon, EditIcon } from '@chakra-ui/icons';
import {
	Box,
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
} from '@chakra-ui/react';
import { useRef } from 'react';
import { MdDelete } from 'react-icons/md';
import { PiPause, PiPlay } from 'react-icons/pi';
import { TbReportSearch } from 'react-icons/tb';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { NAVIGATION } from '../../../../config/const';
import ChatBotService from '../../../../services/chatbot.service';
import { StoreNames, StoreState } from '../../../../store';
import { removeBot, updateBot } from '../../../../store/reducers/ChatBotReducer';
import ConfirmationAlert, { ConfirmationAlertHandle } from '../../../components/confirmation-alert';
import DeleteAlert, { DeleteAlertHandle } from '../../../components/delete-alert';
import Each from '../../../components/utils/Each';

export default function AllResponders() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const {
		list,
		ui: { isLoading },
	} = useSelector((state: StoreState) => state[StoreNames.CHATBOT]);
	const { selected_device_id } = useSelector((state: StoreState) => state[StoreNames.USER]);
	const deleteAlertRef = useRef<DeleteAlertHandle>(null);
	const confirmationAlertRef = useRef<ConfirmationAlertHandle>(null);

	const deleteBot = (id: string) => {
		ChatBotService.DeleteBot({ deviceId: selected_device_id, botId: id }).then((res) => {
			if (!res) return;
			dispatch(removeBot(id));
		});
	};

	const toggleBot = (id: string) => {
		ChatBotService.toggleBot({ deviceId: selected_device_id, botId: id }).then((res) => {
			if (!res) {
				return;
			}
			dispatch(updateBot(res[0]));
		});
	};

	const downloadChatBot = (id: string) => {
		ChatBotService.downloadChatBot({ deviceId: selected_device_id, botId: id });
	};

	const handleEditBot = (id: string) => {
		navigate(`${NAVIGATION.APP}/${NAVIGATION.CHATBOT}/${id}`);
	};

	return (
		<>
			<TableContainer>
				<Table>
					<Thead>
						<Tr>
							<Th width={'35%'}>Trigger</Th>
							<Th width={'35%'}>Message</Th>
							<Th width={'5%'}>Recipients</Th>
							<Th width={'5%'}>Conditions</Th>
							<Th width={'5%'}>Delay</Th>
							<Th width={'10%'}>Actions</Th>
						</Tr>
					</Thead>
					<Tbody>
						{isLoading ? (
							<Tr>
								<Td colSpan={6}>
									<Skeleton height={'50px'} width={'100%'} />
								</Td>
							</Tr>
						) : (
							<Each
								items={list}
								render={(bot, index) => (
									<Tr key={index}>
										<Td>
											{bot.trigger.split('\n').map((trigger, index) => (
												<Box key={index}>
													{trigger.length > 20 ? trigger.substring(0, 18) + '...' : trigger}
												</Box>
											))}
										</Td>
										<Td className='whitespace-break-spaces'>{bot.message}</Td>
										<Td>{bot.respond_to.split('_').join(' ')}</Td>
										<Td>{bot.options.split('_').join(' ')}</Td>
										<Td>
											{bot.trigger_gap_seconds < 60
												? `${bot.trigger_gap_seconds} s`
												: bot.trigger_gap_seconds < 3600
												? `${Math.floor(bot.trigger_gap_seconds / 60)} m`
												: bot.trigger_gap_seconds < 86400
												? `${Math.floor(bot.trigger_gap_seconds / 3600)} h`
												: `${Math.floor(bot.trigger_gap_seconds / 86400)} day`}
										</Td>
										<Td>
											<Tooltip label='Delete Responder' aria-label='Delete Responder'>
												<IconButton
													aria-label='Delete'
													icon={<MdDelete />}
													color={'red.400'}
													onClick={() => {
														deleteAlertRef.current?.open(bot.id);
													}}
													bgColor={'transparent'}
													_hover={{
														bgColor: 'transparent',
													}}
													outline='none'
													border='none'
												/>
											</Tooltip>
											<Tooltip label='Edit Responder' aria-label='Edit Responder'>
												<IconButton
													aria-label='Edit'
													icon={<EditIcon />}
													color={'yellow.400'}
													onClick={() => handleEditBot(bot.id)}
													bgColor={'transparent'}
													_hover={{
														bgColor: 'transparent',
													}}
													outline='none'
													border='none'
												/>
											</Tooltip>
											<Tooltip label='Download Responder' aria-label='Edit Responder'>
												<IconButton
													aria-label='Edit'
													icon={<DownloadIcon />}
													color={'blue.400'}
													onClick={() => downloadChatBot(bot.id)}
													bgColor={'transparent'}
													_hover={{
														bgColor: 'transparent',
													}}
													outline='none'
													border='none'
												/>
											</Tooltip>
											<Tooltip label='Toggle Responder' aria-label='Toggle Responder'>
												<IconButton
													aria-label='toggle'
													icon={bot.isActive ? <PiPause /> : <PiPlay />}
													color={bot.isActive ? 'red.400' : 'green.400'}
													onClick={() => {
														confirmationAlertRef.current?.open({
															id: bot.id,
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
											<Tooltip label='Download Responses' aria-label='Toggle Responder'>
												<IconButton
													aria-label='toggle'
													icon={<TbReportSearch />}
													onClick={() => {
														navigate(
															`${NAVIGATION.APP}/${NAVIGATION.CHATBOT}/button-report/${bot.id}`
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
			<DeleteAlert type={'Responder'} ref={deleteAlertRef} onConfirm={deleteBot} />
			<ConfirmationAlert ref={confirmationAlertRef} onConfirm={toggleBot} disclaimer='' />
		</>
	);
}
