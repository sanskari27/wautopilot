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
import { useRef } from 'react';
import { BiSupport } from 'react-icons/bi';
import { GiCheckMark } from 'react-icons/gi';
import { useDispatch, useSelector } from 'react-redux';
import useFilteredList from '../../../hooks/useFilteredList';
import { StoreNames, StoreState } from '../../../store';
import {
	addSelectedAgent,
	addSingleSelectedAgent,
	clearSelectedAgent,
	removeSelectedAgent,
} from '../../../store/reducers/AgentReducer';
import SearchBar from '../searchBar';
import Each from '../utils/Each';

export default function AgentFilter({
	buttonComponent,
	multiSelect = false,
	onConfirm,
}: {
	buttonComponent?: React.ReactNode;
	multiSelect?: boolean;
	onConfirm: (id: string[]) => void;
}) {
	const buttonRef = useRef<HTMLButtonElement>(null);
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

	const handleConfirm = () => {
		onConfirm(selectedAgent);
		handleClose();
	};

	const handleClose = () => {
		buttonRef.current?.click();
		dispatch(clearSelectedAgent());
	};

	return (
		<Popover onClose={handleClose}>
			<PopoverTrigger>
				{buttonComponent || (
					<IconButton ref={buttonRef} aria-label='filter-button' icon={<BiSupport />} />
				)}
			</PopoverTrigger>
			<PopoverContent>
				<PopoverArrow />
				<PopoverCloseButton ref={buttonRef} />
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
					<Flex
						direction={'column'}
						maxHeight={'300px'}
						overflowY={'scroll'}
						overflowX={'hidden'}
						gap={'0.5rem'}
					>
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
						<Button width={'full'} colorScheme='green' size={'sm'} onClick={handleConfirm}>
							Confirm
						</Button>
					</Flex>
				</PopoverBody>
			</PopoverContent>
		</Popover>
	);
}
