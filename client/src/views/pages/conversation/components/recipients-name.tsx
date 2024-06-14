import { Avatar, Box, Flex, Text } from '@chakra-ui/react';

type Item = {
	_id: string;
	recipient: string;
	profile_name: string;
	origin: string;
	expiration_timestamp: string;
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
		>
			<Avatar name={item.profile_name} />
			<Box>
				<Text fontWeight={'medium'}>{item.profile_name}</Text>
				<Text fontSize={'sm'}>{item.recipient}</Text>
			</Box>
		</Flex>
	);
};

export default RecipientsName;
