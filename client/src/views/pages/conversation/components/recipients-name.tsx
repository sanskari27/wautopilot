import { Avatar, Box, Flex, Icon, Text } from '@chakra-ui/react';
import { TiPinOutline } from 'react-icons/ti';
import { useSelector } from 'react-redux';
import { StoreNames, StoreState } from '../../../../store';
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

	const { selected_recipient } = useSelector((state: StoreState) => state[StoreNames.RECIPIENT]);

	return (
		<Flex
			alignItems={'center'}
			padding={'0.5rem'}
			_hover={{
				backgroundColor: 'gray.100',
				cursor: 'pointer',
			}}
			gap={'0.5rem'}
			key={item._id}
			onClick={handleRecipientClick}
			bg={selected_recipient._id === item._id ? 'gray.100' : 'white'}
			rounded={'lg'}
			className='group'
		>
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
		</Flex>
	);
};

export default RecipientsName;
