import { AddIcon } from '@chakra-ui/icons';
import { Button, Flex, HStack, Text } from '@chakra-ui/react';
import { useNavigate, useOutlet } from 'react-router-dom';
import { NAVIGATION } from '../../../config/const';
import AllRecurringList from './AllRecurringList';

export default function Recurring() {
	const navigate = useNavigate();
	const outlet = useOutlet();

	if (outlet) {
		return outlet;
	}
	return (
		<Flex
			direction={'column'}
			gap={'1rem'}
			className='custom-scrollbar'
			justifyContent={'center'}
			p={'1rem'}
		>
			<HStack justifyContent={'space-between'}>
				<Text fontSize={'2xl'} fontWeight={'bold'}>
					Recurring
				</Text>
				<Button
					size={'sm'}
					leftIcon={<AddIcon />}
					variant={'outline'}
					colorScheme={'green'}
					onClick={() => navigate(`${NAVIGATION.APP}/${NAVIGATION.RECURRING}/new`)}
				>
					Create
				</Button>
			</HStack>
			<AllRecurringList />
		</Flex>
	);
}
