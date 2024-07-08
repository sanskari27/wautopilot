import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Avatar,
	Button,
	Divider,
	Flex,
	Icon,
	Text,
} from '@chakra-ui/react';
import React, { RefObject, forwardRef, useImperativeHandle, useState } from 'react';
import { GiCheckMark } from 'react-icons/gi';
import { useDispatch, useSelector } from 'react-redux';
import useFilteredList from '../../../../hooks/useFilteredList';
import { StoreNames, StoreState } from '../../../../store';
import {
	addSingleSelectedAgent,
	clearSelectedAgent,
	removeSelectedAgent,
} from '../../../../store/reducers/AgentReducer';
import SearchBar from '../../../components/searchBar';
import Each from '../../../components/utils/Each';

export type TransferChatOnDeleteHandle = {
	close: () => void;
	open: (id?: string) => void;
};

type Props = {
	onConfirm: ({ agentId, agentTo }: { agentId: string; agentTo: string }) => void;
};

const TransferChatOnDelete = forwardRef<TransferChatOnDeleteHandle, Props>(
	({ onConfirm }: Props, ref) => {
		const dispatch = useDispatch();
		const [isOpen, setOpen] = useState(false);
		const [id, setId] = useState('' as string);
		const onClose = () => {
			setOpen(false);
			setId('');
			dispatch(clearSelectedAgent());
		};
		const handleDelete = () => {
			onConfirm({ agentId: id, agentTo: '' });
			onClose();
		};

		const { list, selectedAgent } = useSelector((state: StoreState) => state[StoreNames.AGENT]);

		const filteredAgents = list.filter((agent) => agent.id !== id);

		const { filtered, setSearchText } = useFilteredList(filteredAgents, {
			name: 1,
			phone: 1,
		});

		useImperativeHandle(ref, () => ({
			close: () => {
				setOpen(false);
			},
			open: (id: string = '') => {
				setId(id);
				setOpen(true);
			},
		}));

		const cancelRef = React.useRef() as RefObject<HTMLButtonElement>;

		const handleTransfer = () => {
			onConfirm({ agentId: id, agentTo: selectedAgent[0] });
			onClose();
		};

		function handleCheckboxClick(id: string): void {
			if (selectedAgent.includes(id)) {
				dispatch(removeSelectedAgent(id));
			} else {
				dispatch(addSingleSelectedAgent(id));
			}
		}

		return (
			<AlertDialog size={'lg'} isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
				<AlertDialogOverlay />
				<AlertDialogContent backgroundColor={'white'} textColor={'black'}>
					<AlertDialogHeader fontSize='lg' fontWeight='bold'>
						Are you sure?
					</AlertDialogHeader>

					<AlertDialogBody>
						<Text>
							There may be some chats assigned to this agent, please transfer the assigned chats (if
							any).
						</Text>
						<Flex alignItems={'center'}>
							<SearchBar timeout={100} onSearchTextChanged={setSearchText} />
						</Flex>
						<Flex
							direction={'column'}
							maxHeight={'300px'}
							overflowY={'scroll'}
							overflowX={'hidden'}
							gap={'0.5rem'}
							mt={'1rem'}
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
						</Flex>
						<Divider my={'0.5rem'} />
						<Button
							isDisabled={selectedAgent.length === 0}
							width={'full'}
							colorScheme='green'
							onClick={handleTransfer}
						>
							Confirm
						</Button>
					</AlertDialogBody>

					<AlertDialogFooter alignItems={'flex-end'}>
						<Button ref={cancelRef} onClick={onClose}>
							Cancel
						</Button>
						<Button colorScheme='red' onClick={handleDelete} ml={3}>
							Continue without transfer
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		);
	}
);

export default TransferChatOnDelete;
