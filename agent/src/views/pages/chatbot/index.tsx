/* eslint-disable no-mixed-spaces-and-tabs */
import { AddIcon } from '@chakra-ui/icons';
import { Button, Flex, HStack, Text } from '@chakra-ui/react';
import { Link, useOutlet } from 'react-router-dom';
import { NAVIGATION } from '../../../config/const';
import usePermissions from '../../../hooks/usePermissions';
import Show from '../../components/utils/Show';
import AllResponders from './components/AllResponders';

export default function ChatBotPage() {
	const outlet = useOutlet();

	const {
		chatbot: { create: create_permission },
	} = usePermissions();

	if (outlet) {
		return outlet;
	} else {
		return (
			<Flex
				direction={'column'}
				gap={'0.5rem'}
				className='custom-scrollbar'
				justifyContent={'center'}
				p={'1rem'}
			>
				<HStack justifyContent={'space-between'}>
					<Text fontSize={'2xl'} fontWeight={'bold'}>
						ChatBots
					</Text>
					<Show>
						<Show.When condition={create_permission}>
							<Link to={`${NAVIGATION.APP}/${NAVIGATION.CHATBOT}/new`}>
								<Button variant='outline' size={'sm'} colorScheme='green' leftIcon={<AddIcon />}>
									Create Chatbot
								</Button>
							</Link>
						</Show.When>
					</Show>
				</HStack>
				<AllResponders />
			</Flex>
		);
	}
}
