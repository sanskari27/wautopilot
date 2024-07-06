import { ChevronDownIcon } from '@chakra-ui/icons';
import {
	Box,
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
} from '@chakra-ui/react';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { NAVIGATION } from '../../../../config/const';
import ChatbotFlowService from '../../../../services/chatbot-flow.service';
import { StoreNames, StoreState } from '../../../../store';
import { removeBot, updateBot } from '../../../../store/reducers/ChatBotReducer';
import ConfirmationAlert, { ConfirmationAlertHandle } from '../../../components/confirmation-alert';
import DeleteAlert, { DeleteAlertHandle } from '../../../components/delete-alert';
import Each from '../../../components/utils/Each';

export default function AllChatbotFlows() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const {
		list,
		ui: { isLoading },
	} = useSelector((state: StoreState) => state[StoreNames.CHATBOT_FLOW]);
	const { selected_device_id } = useSelector((state: StoreState) => state[StoreNames.USER]);
	const deleteAlertRef = useRef<DeleteAlertHandle>(null);
	const confirmationAlertRef = useRef<ConfirmationAlertHandle>(null);

	const deleteBot = (id: string) => {
		ChatbotFlowService.deleteChatbotFlow({ deviceId: selected_device_id, botId: id }).then(
			(res) => {
				if (!res) return;
				dispatch(removeBot(id));
			}
		);
	};

	const toggleBot = (id: string) => {
		ChatbotFlowService.toggleChatbotFlow({ deviceId: selected_device_id, botId: id }).then(
			(res) => {
				if (!res) {
					return;
				}
				dispatch(updateBot(res[0]));
			}
		);
	};

	const handleEditBot = (id: string) => {
		navigate(`${NAVIGATION.APP}/${NAVIGATION.CHATBOT_FLOW}/${id}`);
	};

	return (
		<>
			<TableContainer border={'1px dashed gray'} rounded={'2xl'}>
				<Table variant='striped' colorScheme='gray'>
					<Thead>
						<Tr>
							<Th width={'35%'}>Name</Th>
							<Th width={'35%'}>Trigger</Th>
							<Th width={'5%'}>Recipients</Th>
							<Th width={'5%'}>Conditions</Th>
							<Th width={'10%'}>Actions</Th>
						</Tr>
					</Thead>
					<Tbody>
						{isLoading ? (
							<Tr>
								<Td colSpan={5}>
									<Skeleton height={'50px'} width={'100%'} />
								</Td>
							</Tr>
						) : (
							<Each
								items={list}
								render={(bot, index) => (
									<Tr key={index}>
										<Td>{bot.name}</Td>
										<Td>
											{bot.trigger.split('\n').map((trigger, index) => (
												<Box key={index}>
													{trigger.length > 20 ? trigger.substring(0, 18) + '...' : trigger}
												</Box>
											))}
										</Td>
										<Td>{bot.respond_to.split('_').join(' ')}</Td>
										<Td>{bot.options.split('_').join(' ')}</Td>
										<Td>
											<Menu>
												<MenuButton as={Button} rightIcon={<ChevronDownIcon />} size='sm'>
													Actions
												</MenuButton>
												<MenuList>
													<MenuItem onClick={() => handleEditBot(bot.id)}>Edit</MenuItem>
													<MenuItem
														onClick={() =>
															confirmationAlertRef.current?.open({
																id: bot.id,
																disclaimer: 'Are you sure you want to change running status?',
																type: 'TOGGLE_BOT',
															})
														}
													>
														<Text color={bot.isActive ? 'red' : 'green'}>
															{bot.isActive ? 'Stop' : 'Play'}
														</Text>
													</MenuItem>
													<MenuItem
														onClick={() =>
															navigate(
																`${NAVIGATION.APP}/${NAVIGATION.CHATBOT}/button-report/${bot.id}`
															)
														}
													>
														Button Click Report
													</MenuItem>
													<MenuItem onClick={() => deleteAlertRef.current?.open(bot.id)}>
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
			<DeleteAlert type={'Responder'} ref={deleteAlertRef} onConfirm={deleteBot} />
			<ConfirmationAlert ref={confirmationAlertRef} onConfirm={toggleBot} disclaimer='' />
		</>
	);
}
