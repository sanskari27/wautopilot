import { Avatar, Box, Flex, HStack, Icon, Tag, Text } from '@chakra-ui/react';
import { GiCheckMark } from 'react-icons/gi';
import { TiPinOutline } from 'react-icons/ti';
import { useDispatch, useSelector } from 'react-redux';
import { StoreNames, StoreState } from '../../../../store';
import { addRemoveRecipientList } from '../../../../store/reducers/RecipientReducer';
import Each from '../../../components/utils/Each';
import ContextMenu from './recipient-context-menu';

type Item = {
	_id: string;
	recipient: string;
	profile_name: string;
	origin: string;
	labels: string[];
};

type RecipientsNameProps = {
	item: Item;
	onClick?: (item: Item) => void;
};

const RecipientsName = ({ item, onClick }: RecipientsNameProps) => {
	const dispatch = useDispatch();
	const handleRecipientClick = () => {
		// setListExpanded.off();
		onClick?.(item);
	};

	const { selected_recipient, unReadConversations, selected_recipient_list } = useSelector(
		(state: StoreState) => state[StoreNames.RECIPIENT]
	);

	const hasUnreadConversation = unReadConversations.includes(item._id);

	const handleClick = (e: React.MouseEvent, id: string) => {
		e.stopPropagation();
		dispatch(addRemoveRecipientList(id));
	};

	return (
		<Box
			_hover={{
				backgroundColor: 'gray.100',
				cursor: 'pointer',
			}}
			bg={selected_recipient._id === item._id ? 'gray.100' : 'white'}
			rounded={'lg'}
			padding={'0.5rem'}
			borderBottomWidth={'1px'}
			onClick={handleRecipientClick}
		>
			<Flex alignItems={'center'} key={item._id} className='group' direction={'column'}>
				<Flex width={'full'} gap={'0.5rem'} position={'relative'}>
					<Box position={'relative'}>
						{selected_recipient_list.includes(item._id) ? (
							<Flex
								height={'3rem'}
								width={'3rem'}
								bgColor={'blue.500'}
								rounded={'full'}
								onClick={(e) => handleClick(e, item._id)}
								justifyContent={'center'}
								alignItems={'center'}
							>
								<Icon as={GiCheckMark} color={'white'} mx={'auto'} />
							</Flex>
						) : (
							<Avatar name={item.profile_name} onClick={(e) => handleClick(e, item._id)}></Avatar>
						)}
						{localStorage.getItem('pinned')?.includes(item._id) && (
							<Icon as={TiPinOutline} mr={2} position={'absolute'} right={'-15px'} />
						)}
					</Box>
					<Box>
						<Text fontWeight={'medium'} className='line-clamp-1'>
							{item.profile_name}
						</Text>
						<Text fontSize={'sm'}>{item.recipient}</Text>
					</Box>
					<ContextMenu recipient={item} />
					{hasUnreadConversation ? (
						<Box
							width={'0.75rem'}
							height={'0.75rem'}
							position={'absolute'}
							bgColor={'green'}
							rounded={'full'}
							right={0}
							top={'calc(50% - 0.375rem)'}
						/>
					) : null}
				</Flex>
			</Flex>
			<HStack justifyContent={'flex-start'} width={'full'} overflowX={'auto'}>
				<Each
					items={item.labels}
					render={(label) => (
						<Tag variant={'subtle'} minWidth={'max-content'} mt={'0.5rem'}>
							{label}
						</Tag>
					)}
				/>
			</HStack>
		</Box>
	);
};

export default RecipientsName;
