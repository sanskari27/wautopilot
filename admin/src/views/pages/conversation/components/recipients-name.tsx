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
		<Box
			_hover={{
				backgroundColor: 'gray.100',
				cursor: 'pointer',
			}}
			bg={selected_recipient._id === item._id ? 'gray.100' : 'white'}
			rounded={'lg'}
			padding={'0.5rem'}
			borderBottomWidth={'1px'}
		>
			<Flex
				alignItems={'center'}
				key={item._id}
				onClick={handleRecipientClick}
				className='group'
				direction={'column'}
			>
				<Flex width={'full'} gap={'0.5rem'}>
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
			</Flex>
			{/* <HStack justifyContent={'flex-start'} width={'full'} overflowX={'auto'}>
				<Each
					items={item.labels}
					render={(label) => (
						<Tag colorScheme='gray.700' minWidth={'max-content'} mt={'0.5rem'}>
							{label}
						</Tag>
					)}
				/>
				<Each items={item.labels} render={(label) => <Tag minWidth={'max-content'} mt={'0.5rem'}>{label}</Tag>} />
				<Each items={item.labels} render={(label) => <Tag minWidth={'max-content'} mt={'0.5rem'}>{label}</Tag>} />
				<Each items={item.labels} render={(label) => <Tag minWidth={'max-content'} mt={'0.5rem'}>{label}</Tag>} />
				<Each items={item.labels} render={(label) => <Tag minWidth={'max-content'} mt={'0.5rem'}>{label}</Tag>} />
				<Each items={item.labels} render={(label) => <Tag minWidth={'max-content'} mt={'0.5rem'}>{label}</Tag>} />
				<Each items={item.labels} render={(label) => <Tag minWidth={'max-content'} mt={'0.5rem'}>{label}</Tag>} />
				<Each items={item.labels} render={(label) => <Tag minWidth={'max-content'} mt={'0.5rem'}>{label}</Tag>} />
			</HStack> */}
		</Box>
	);
};

export default RecipientsName;
