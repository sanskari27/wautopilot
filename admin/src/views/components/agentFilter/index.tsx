import {
	Avatar,
	Box,
	Button,
	Divider,
	Flex,
	Icon,
	IconButton,
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverCloseButton,
	PopoverContent,
	PopoverHeader,
	PopoverTrigger,
	Text,
} from '@chakra-ui/react';
import { BiSupport } from 'react-icons/bi';
import { GiCheckMark } from 'react-icons/gi';
import { useDispatch, useSelector } from 'react-redux';
import useFilteredList from '../../../hooks/useFilteredList';
import { StoreNames, StoreState } from '../../../store';
import {
	addSelectedAgent,
	addSingleSelectedAgent,
	removeSelectedAgent,
} from '../../../store/reducers/AgentReducer';
import SearchBar from '../searchBar';
import Each from '../utils/Each';

export default function AgentFilter({
	buttonComponent,
	multiSelect = false,
}: // onAddLabel,
// onRemoveLabel,
// onClear,
// selectedLabels,
{
	buttonComponent?: React.ReactNode;
	multiSelect?: boolean;
}) {
	const dispatch = useDispatch();
	const { list, selectedAgent } = useSelector((state: StoreState) => state[StoreNames.AGENT]);

	const { filtered, setSearchText } = useFilteredList(list, {
		name: 1,
		phone: 1,
	});

	function handleCheckboxClick(id: string): void {
		if (multiSelect) {
			if (selectedAgent.includes(id)) {
				dispatch(removeSelectedAgent(id));
			} else {
				dispatch(addSelectedAgent(id));
			}
		} else {
			if (selectedAgent.includes(id)) {
				dispatch(removeSelectedAgent(id));
			} else {
				dispatch(addSingleSelectedAgent(id));
			}
		}
	}

	return (
		<Popover>
			<PopoverTrigger>
				{buttonComponent || <IconButton aria-label='filter-button' icon={<BiSupport />} />}
			</PopoverTrigger>
			<PopoverContent>
				<PopoverArrow />
				<PopoverCloseButton />
				<PopoverHeader>
					<Flex justifyContent={'space-between'}>
						<Text fontWeight={'medium'} fontSize={'lg'} textAlign={'center'} mb={'0.25rem'}>
							Select Agents
						</Text>
						<Box />
					</Flex>
					<Flex alignItems={'center'}>
						<SearchBar timeout={100} onSearchTextChanged={setSearchText} />
					</Flex>
				</PopoverHeader>
				<PopoverBody>
					<Flex direction={'column'} maxHeight={'300px'} overflowY={'scroll'} overflowX={'hidden'}>
						<Each
							items={filtered}
							render={(agent) => (
								<Flex alignItems={'center'} gap={'0.5rem'}>
									{selectedAgent.includes(agent.id) ? (
										<Flex
											height={'2rem'}
											width={'2rem'}
											bgColor={'blue.500'}
											rounded={'full'}
											onClick={() => handleCheckboxClick(agent.id)}
											justifyContent={'center'}
											alignItems={'center'}
											cursor={'pointer'}
										>
											<Icon as={GiCheckMark} color={'white'} mx={'auto'} />
										</Flex>
									) : (
										<Avatar
											cursor={'pointer'}
											size={'sm'}
											name={agent.name}
											onClick={() => handleCheckboxClick(agent.id)}
										/>
									)}
									<Text>{agent.name}</Text>
								</Flex>
							)}
						/>
						<Divider my={'0.5rem'} />
						<Button width={'full'} colorScheme='green' size={'sm'}>
							Confirm
						</Button>
					</Flex>
				</PopoverBody>
			</PopoverContent>
		</Popover>
	);
}
