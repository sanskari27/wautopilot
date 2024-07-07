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
import usePermissions from '../../../../hooks/usePermissions';
import ChatBotService from '../../../../services/chatbot.service';
import { StoreNames, StoreState } from '../../../../store';
import { removeBot, updateBot } from '../../../../store/reducers/ChatBotReducer';
import ConfirmationAlert, { ConfirmationAlertHandle } from '../../../components/confirmation-alert';
import DeleteAlert, { DeleteAlertHandle } from '../../../components/delete-alert';
import Each from '../../../components/utils/Each';
import Show from '../../../components/utils/Show';

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
	const {
		chatbot: { update: update_permission, delete: delete_permission, export: export_permission },
		buttons: { read: button_read_permission },
	} = usePermissions();

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

	const canManipulate =
		update_permission || delete_permission || export_permission || button_read_permission;

	return (
		<>
			<TableContainer border={'1px dashed gray'} rounded={'2xl'}>
				<Table variant='striped' colorScheme='gray'>
					<Thead>
						<Tr>
							<Th width={'35%'}>Trigger</Th>
							<Th width={'35%'}>Message</Th>
							<Th width={'5%'}>Recipients</Th>
							<Th width={'5%'}>Conditions</Th>
							<Th width={'5%'}>Delay</Th>
							<Show>
								<Show.When condition={canManipulate}>
									<Th width={'10%'}>Actions</Th>
								</Show.When>
							</Show>
						</Tr>
					</Thead>
					<Tbody>
						<Show>
							<Show.When condition={isLoading}>
								<Each
									items={Array.from({ length: 20 })}
									render={() => (
										<Tr>
											<Td colSpan={canManipulate ? 6 : 5}>
												<Skeleton height={'50px'} width={'100%'} />
											</Td>
										</Tr>
									)}
								/>
							</Show.When>
							<Show.When condition={list.length === 0}>
								<Tr>
									<Td colSpan={canManipulate ? 6 : 5} textAlign={'center'}>
										No records found
									</Td>
								</Tr>
							</Show.When>

							<Show.Else>
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
												<Menu>
													<MenuButton as={Button} rightIcon={<ChevronDownIcon />} size='sm'>
														Actions
													</MenuButton>
													<MenuList>
														<Show>
															<Show.When condition={update_permission}>
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
															</Show.When>
														</Show>
														<Show>
															<Show.When condition={export_permission}>
																<MenuItem onClick={() => downloadChatBot(bot.id)}>
																	Download Report
																</MenuItem>
															</Show.When>
														</Show>
														<Show>
															<Show.When condition={button_read_permission}>
																<MenuItem
																	onClick={() =>
																		navigate(
																			`${NAVIGATION.APP}/${NAVIGATION.CHATBOT}/button-report/${bot.id}`
																		)
																	}
																>
																	Button Click Report
																</MenuItem>
															</Show.When>
														</Show>
														<Show>
															<Show.When condition={delete_permission}>
																<MenuItem onClick={() => deleteAlertRef.current?.open(bot.id)}>
																	Delete
																</MenuItem>
															</Show.When>
														</Show>
													</MenuList>
												</Menu>
											</Td>
										</Tr>
									)}
								/>
							</Show.Else>
						</Show>
					</Tbody>
				</Table>
			</TableContainer>
			<DeleteAlert type={'Responder'} ref={deleteAlertRef} onConfirm={deleteBot} />
			<ConfirmationAlert ref={confirmationAlertRef} onConfirm={toggleBot} disclaimer='' />
		</>
	);
}
