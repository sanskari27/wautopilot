import { Avatar, Box, Flex, HStack, Icon, Tag, Text } from '@chakra-ui/react';
import { TiPinOutline } from 'react-icons/ti';
import { useSelector } from 'react-redux';
import { StoreNames, StoreState } from '../../../../store';
import Each from '../../../components/utils/Each';
import ContextMenu from './recipient-context-menu';

type Item = {
	_id: string;
	recipient: string;
	profile_name: string;
	origin: string;
	expiration_timestamp: string;
	labels: string[];
};

type RecipientsNameProps = {
	item: Item;
	onClick?: (item: Item) => void;
};

const RecipientsName = ({ item, onClick }: RecipientsNameProps) => {
	const handleRecipientClick = () => {
		// setListExpanded.off();
		onClick?.(item);
	};

	const { selected_recipient, unReadConversations } = useSelector(
		(state: StoreState) => state[StoreNames.RECIPIENT]
	);

	const hasUnreadConversation = unReadConversations.includes(item._id);

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
						<Avatar name={item.profile_name} />
						{localStorage.getItem('pinned')?.includes(item._id) && (
							<Icon as={TiPinOutline} mr={2} position={'absolute'} right={'-15px'} />
						)}
					</Box>
					<Box>
						<Text fontWeight={'medium'} className='line-clamp-1 w-[250px] md:w-[150px]'>
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
