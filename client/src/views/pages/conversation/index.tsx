import { Box, Flex, HStack, Skeleton, Stack, Text, useBoolean } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useFilteredList from '../../../hooks/useFilteredList';
import MessagesService from '../../../services/messages.service';
import { StoreNames, StoreState } from '../../../store';
import {
	reset,
	setMessageList,
	setMessagesLoading,
} from '../../../store/reducers/MessagesReducers';
import { setSelectedRecipient } from '../../../store/reducers/RecipientReducer';
import { Recipient } from '../../../store/types/RecipientsState';
import LabelFilter from '../../components/labelFilter';
import SearchBar from '../../components/searchBar';
import Each from '../../components/utils/Each';
import ChatScreen from './components/chat-screen';
import RecipientsName from './components/recipients-name';

const Conversation = () => {
	const dispatch = useDispatch();
	const [listExpanded, setListExpanded] = useBoolean(true);

	const { selected_device_id } = useSelector((state: StoreState) => state[StoreNames.USER]);
	const {
		list,
		uiDetails: { loading },
		selected_recipient,
	} = useSelector((state: StoreState) => state[StoreNames.RECIPIENT]);

	const { filtered, setSearchText } = useFilteredList(list, {
		profile_name: 1,
		recipient: 1,
	});

	useEffect(() => {
		return () => {
			dispatch(setSelectedRecipient({} as Recipient));
		};
	}, [dispatch]);

	const handleRecipientClick = (item: Recipient) => {
		setListExpanded.off();
		if (selected_recipient._id === item._id) return;
		dispatch(setMessagesLoading(true));
		dispatch(setSelectedRecipient(item));
		if (!selected_device_id) return;
		MessagesService.fetchConversationMessages(selected_device_id, item._id).then((data) => {
			console.log(data);
			dispatch(setMessageList(data));
			dispatch(setMessagesLoading(false));
		});
	};

	useEffect(() => {
		dispatch(reset());
	}, [dispatch]);

	return (
		<Box className='' height={'full'}>
			<Flex width={'full'} height={'calc(100vh - 60px)'}>
				<Flex
					direction={'column'}
					className={`md:border-r-2 overflow-hidden md:!w-[400px] bg-white p-2 ${
						listExpanded ? '!w-full' : '!hidden md:!flex'
					}`}
				>
					<Text fontWeight={'medium'} fontSize={'lg'}>
						Chats
					</Text>
					<HStack mb={'0.5rem'} marginRight={'0.5rem'} className='pr-2 md:!px-0'>
						<SearchBar onSearchTextChanged={setSearchText} />
						<LabelFilter
						//  onChange={(labels) => dispatch(setLabels(labels))}
						/>
					</HStack>
					<Flex direction={'column'} overflowY={'auto'}>
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
							<Each
								items={filtered}
								render={(item) => <RecipientsName onClick={handleRecipientClick} item={item} />}
							/>
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
