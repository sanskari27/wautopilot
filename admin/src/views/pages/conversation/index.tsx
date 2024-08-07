import { Box, Flex, HStack, Skeleton, Stack, Text, useBoolean, useToast } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { SERVER_URL } from '../../../config/const';
import { useFetchLabels } from '../../../hooks/useFetchLabels';
import useFilterLabels from '../../../hooks/useFilterLabels';
import useFilteredList from '../../../hooks/useFilteredList';
import AgentService from '../../../services/agent.service';
import AuthService from '../../../services/auth.service';
import MessagesService from '../../../services/messages.service';
import { StoreNames, StoreState } from '../../../store';
import {
	addMessage,
	reset,
	selectQuickReply,
	setTextMessage,
	updateMessage,
} from '../../../store/reducers/MessagesReducers';
import {
	addUnreadConversation,
	clearSelectedRecipientList,
	setLabelFilter,
	setRecipientsList,
	setSelectedRecipient,
} from '../../../store/reducers/RecipientReducer';
import { Recipient } from '../../../store/types/RecipientsState';
import AgentFilter from '../../components/agentFilter';
import LabelFilter from '../../components/labelFilter';
import SearchBar from '../../components/searchBar';
import Each from '../../components/utils/Each';
import ChatScreen from './components/chat-screen';
import RecipientsName from './components/recipients-name';

const Conversation = () => {
	const dispatch = useDispatch();
	const toast = useToast();
	const [listExpanded, setListExpanded] = useBoolean(true);

	const { selected_device_id } = useSelector((state: StoreState) => state[StoreNames.USER]);
	const {
		pinnedConversations,
		unpinnedConversations,
		uiDetails: { loading },
		selected_recipient,
		selected_recipient_list,
	} = useSelector((state: StoreState) => state[StoreNames.RECIPIENT]);

	const { all_labels } = useFetchLabels();

	const { onAddLabel, onRemoveLabel, selectedLabels, onClear } = useFilterLabels();

	const { filtered: filteredPinned, setSearchText: setSearchTextPinned } = useFilteredList(
		pinnedConversations,
		{
			profile_name: 1,
			recipient: 1,
		}
	);

	const { filtered: filteredUnpinned, setSearchText: setSearchTextUnpinned } = useFilteredList(
		unpinnedConversations,
		{
			profile_name: 1,
			recipient: 1,
		}
	);

	useEffect(() => {
		return () => {
			dispatch(setSelectedRecipient({} as Recipient));
		};
	}, [dispatch]);

	const handleRecipientClick = (item: Recipient) => {
		setListExpanded.off();
		if (selected_recipient._id === item._id) return;
		dispatch(setSelectedRecipient(item));
		dispatch(selectQuickReply(''));
		dispatch(setTextMessage(''));
	};

	const handleAddRecipientLabel = (label: string) => {
		onAddLabel(label);
		dispatch(setLabelFilter(selectedLabels));
	};

	const handleRemoveRecipientLabel = (label: string) => {
		onRemoveLabel(label);
		dispatch(setLabelFilter(selectedLabels));
	};

	const handleAssignConversationToAgent = (id: string[]) => {
		if (selected_recipient_list.length === 0) return;
		if (id.length === 0) {
			const promises = selected_recipient_list.map((recipient) => {
				return AgentService.removeConversationFromAgent({
					conversationId: recipient,
					device_id: selected_device_id,
				});
			});

			toast.promise(Promise.all(promises), {
				loading: { title: 'Assigning conversation to agent' },
				success: () => {
					dispatch(clearSelectedRecipientList());
					return { title: 'Conversation assigned to agent' };
				},
				error: { title: 'Failed to assign conversation to agent' },
			});
			return;
		}
		const promises = selected_recipient_list.map((recipient) => {
			return AgentService.assignConversationToAgent({
				agentId: id[0],
				conversationId: recipient,
				device_id: selected_device_id,
			});
		});

		toast.promise(Promise.all(promises), {
			loading: { title: 'Assigning conversation to agent' },
			success: () => {
				dispatch(clearSelectedRecipientList());
				return { title: 'Conversation assigned to agent' };
			},
			error: { title: 'Failed to assign conversation to agent' },
		});
	};

	useEffect(() => {
		MessagesService.fetchAllConversation(selected_device_id, selectedLabels).then((data) =>
			dispatch(setRecipientsList(data))
		);
	}, [dispatch, selectedLabels, selected_device_id]);

	useEffect(() => {
		const socket = io(SERVER_URL + 'conversation');

		socket.on('connect', () => {
			socket.emit('join_conversation', selected_recipient._id);
			AuthService.generateConversationMessageKey().then((key) => {
				socket.emit('listen_new_messages', key);
			});
		});

		socket.on('disconnect', () => {});

		socket.on('message_new', (msg) => {
			dispatch(addMessage(msg));
			// if (msg.received_at) {
			// 	MessagesService.markRead(selected_device_id, msg.message_id);
			// }
		});

		socket.on('message_updated', (msg) => {
			dispatch(updateMessage({ messageId: msg._id, message: msg }));
		});

		socket.on('new_message_notification', (conversation_id) => {
			dispatch(addUnreadConversation(conversation_id));
		});

		socket.on('message_updated', (msg) => {
			dispatch(updateMessage({ messageId: msg._id, message: msg }));
		});

		return () => {
			socket.disconnect();
		};
	}, [selected_recipient._id, dispatch, selected_device_id]);

	useEffect(() => {
		dispatch(reset());
	}, [dispatch]);

	return (
		<Box className='' height={'full'}>
			<Flex width={'full'} height={'calc(100vh - 60px)'}>
				<Flex
					direction={'column'}
					className={`md:border-r-2 overflow-hidden md:!w-[30%] md:min-w-[350px] bg-white p-2 ${
						listExpanded ? '!w-full' : '!hidden md:!flex'
					}`}
				>
					<Text fontWeight={'medium'} fontSize={'lg'}>
						Chats
					</Text>
					<HStack mb={'0.5rem'} marginRight={'0.5rem'} className='pr-2 md:!px-0'>
						<SearchBar
							onSearchTextChanged={(text) => {
								setSearchTextPinned(text);
								setSearchTextUnpinned(text);
							}}
						/>
						<LabelFilter
							labels={all_labels}
							onAddLabel={(label) => handleAddRecipientLabel(label)}
							onRemoveLabel={(label) => handleRemoveRecipientLabel(label)}
							selectedLabels={selectedLabels}
							onClear={onClear}
						/>
						{selected_recipient_list.length > 0 && (
							<AgentFilter onConfirm={handleAssignConversationToAgent} />
						)}
					</HStack>
					<Flex direction={'column'} overflowY={'auto'} overflowX={'hidden'}>
						{loading ? (
							<Stack>
								<Skeleton height='50px' />
								<Skeleton height='50px' />
								<Skeleton height='50px' />
								<Skeleton height='50px' />
								<Skeleton height='50px' />
								<Skeleton height='50px' />
								<Skeleton height='50px' />
							</Stack>
						) : (
							<>
								<Each
									items={filteredPinned}
									render={(item) => <RecipientsName onClick={handleRecipientClick} item={item} />}
								/>
								<Each
									items={filteredUnpinned}
									render={(item) => <RecipientsName onClick={handleRecipientClick} item={item} />}
								/>
							</>
						)}
					</Flex>
				</Flex>
				<Box className={`md:w-full ${listExpanded ? 'hidden md:block' : 'w-full'} overflow-hidden`}>
					{selected_recipient._id ? (
						<>
							<ChatScreen closeChat={setListExpanded.on} />
						</>
					) : null}
				</Box>
			</Flex>
		</Box>
	);
};

export default Conversation;
